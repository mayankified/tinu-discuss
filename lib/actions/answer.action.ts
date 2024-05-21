"use server";

import Answers from "@/database/answer.model";
import { connectDB } from "../mongoose";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "./shared.types";
import Questions from "@/database/question.model";
import { revalidatePath } from "next/cache";
import Interaction from "@/database/interaction.model";
import User from "@/database/user.model";

export async function CreateAns(params: CreateAnswerParams) {
  try {
    connectDB();

    const { content, author, path, question } = params;

    const newAnswer = await Answers.create({
      content,
      author,
      question,
    });

    //we need to add answr to the question model also

    const questionObj = await Questions.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    //we also need to increase karma of the author

    await Interaction.create({
      user: author,
      action: "answer",
      question,
      answer: newAnswer._id,
      tags: questionObj.tags,
    });

    await User.findByIdAndUpdate(author, {
      $inc: { reputation: 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAnswer(params: GetAnswersParams) {
  try {
    connectDB();
    const { questionId, sortBy } = params;
    let sortOptions = {};

    switch (sortBy) {
      case "highestUpvotes":
        sortOptions = {
          upvotes: -1,
        };
        break;

      case "lowestUpvotes":
        sortOptions = {
          upvotes: 1,
        };
        break;

      case "recent":
        sortOptions = {
          createdAt: -1,
        };
        break;
      case "old":
        sortOptions = {
          createdAt: +1,
        };
        break;

        break;

      default:
        break;
    }
    const answer = await Answers.find({ question: questionId })

      .populate("author", "_id name clerkId picture")
      .sort(sortOptions);

    return { answer };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function upvoteAns(params: AnswerVoteParams) {
  try {
    connectDB();
    const { answerId, hasdownVoted, hasupVoted, userId, path } = params;

    let updateQuery = {};

    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }

    const answer = await Answers.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });
    if (!answer) throw new Error("Answer not found");

    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupVoted ? -2 : 2 },
    });

    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasupVoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteAns(params: AnswerVoteParams) {
  try {
    connectDB();
    const { answerId, hasdownVoted, hasupVoted, userId, path } = params;

    let updatequery = {};

    if (hasdownVoted) {
      updatequery = { $pull: { downvotes: userId } };
    } else if (hasupVoted) {
      updatequery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updatequery = { $addToSet: { downvotes: userId } };
    }
    const answer = await Answers.findByIdAndUpdate(answerId, updatequery, {
      new: true,
    });
    if (!answer) throw new Error("Answer not found");

    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasdownVoted ? -2 : 2 },
    });

    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasdownVoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
    connectDB();
    const { answerId, path } = params;
    const answer = await Answers.findById(answerId);

    if (!answer) {
      throw new Error("Answer not Found");
    }

    await Answers.deleteOne({ _id: answerId });
    await Answers.deleteMany({ question: answerId });
    await Interaction.deleteMany({ answer: answerId });
    await Questions.updateMany(
      {
        answers: answer.question,
      },
      { $pull: { answers: answerId } }
    );
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
