"use server";

import Questions from "@/database/question.model";
import { connectDB } from "../mongoose";
import { FilterQuery } from "mongoose";
import Tag from "@/database/tag.model";
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
} from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import Answers from "@/database/answer.model";
import Interaction from "@/database/interaction.model";

export async function CreateQue(params: CreateQuestionParams) {
  try {
    connectDB();

    const { title, content, tags, author, path } = params;

    const question = await Questions.create({
      title,
      content,
      author,
    });

    const tagDoc = [];
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        {
          name: { $regex: new RegExp(`^${tag}$`, "i") },
        },
        {
          $setOnInsert: { name: tag },
          $push: { questions: question._id },
        },
        { upsert: true, new: true }
      );
      tagDoc.push(existingTag._id);
    }
    await Questions.findByIdAndUpdate(question._id, {
      $push: { tag: { $each: tagDoc } },
    });

    await Interaction.create({
      user: author,
      action: "ask_que",
      question: question._id,
      tags: tagDoc,
    });

    await User.findByIdAndUpdate(author, {
      $inc: { reputation: 5 },
    });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestion(params: GetQuestionsParams) {
  try {
    connectDB();
    const { searchQuery, filter, page = 1, pageSize = 10 } = params;
    const query: FilterQuery<typeof Questions> = {};
    if (searchQuery) {
      query.$or = [
        {
          title: { $regex: new RegExp(searchQuery, "i") },
        },
        {
          content: { $regex: new RegExp(searchQuery, "i") },
        },
      ];
    }
    let sortOptions = {};
    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "frequent":
        sortOptions = { views: -1 };

        break;
      case "unanswered":
        query.answers = { $size: 0 };
        break;

      default:
        break;
    }

    const skipAmt = (page - 1) * pageSize;

    const questions = await Questions.find(query)
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({
        path: "author",
        model: User,
      })
      .sort(sortOptions)
      .skip(skipAmt)
      .limit(pageSize);

    const totalQue = await Questions.countDocuments(query);
    const isNext = totalQue > skipAmt + questions.length;

    return { questions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionbyId(params: GetQuestionByIdParams) {
  try {
    connectDB();
    const { questionId } = params;
    const questions = await Questions.findById(questionId)
      .populate({
        path: "tags",
        model: Tag,
        select: "_id name",
      })
      .populate({
        path: "author",
        model: User,
        select: "_id name clerkId username name picture",
      });

    return questions;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function upvoteQue(params: QuestionVoteParams) {
  try {
    connectDB();
    const { questionId, hasdownVoted, hasupVoted, userId, path } = params;

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

    const question = await Questions.findByIdAndUpdate(
      questionId,
      updateQuery,
      { new: true }
    );
    if (!question) throw new Error("Question not found");

    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupVoted ? -1 : 1 },
    });

    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasupVoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteQue(params: QuestionVoteParams) {
  try {
    connectDB();
    const { questionId, hasdownVoted, hasupVoted, userId, path } = params;

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
    const question = await Questions.findByIdAndUpdate(
      questionId,
      updatequery,
      { new: true }
    );
    if (!question) throw new Error("Question not found");

    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasdownVoted ? -1 : 1 },
    });

    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasdownVoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    connectDB();
    const { questionId, path } = params;
    await Questions.deleteOne({ _id: questionId });
    await Answers.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });
    await Tag.updateMany(
      {
        questions: questionId,
      },
      { $pull: { questions: questionId } }
    );
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    connectDB();
    const { questionId, title, content, path } = params;
    const question = await Questions.findById(questionId).populate({
      path: "tags",
      model: Tag,
      select: "_id name",
    });
    if (!question) throw new Error("Question not found");

    question.title = title;
    question.content = content;
    await question.save();
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getHotQuestion() {
  try {
    connectDB();
    const HotQue = await Questions.find({})
      .sort({ views: -1, upvotes: -1 })
      .limit(5);
    return HotQue;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
