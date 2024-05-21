"use server";

import Questions from "@/database/question.model";
import User from "@/database/user.model";
import { connectDB } from "../mongoose";
import { FilterQuery } from "mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Tag from "@/database/tag.model";
import Answers from "@/database/answer.model";
import { BadgeCriteriaType } from "@/types";
import { assignBadges } from "../utils";

export async function getUserbyId(params: any) {
  try {
    connectDB();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    connectDB();
    const newUser = await User.create(userData);
    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectDB();
    const { clerkId, path, updateData } = params;
    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectDB();
    const { clerkId } = params;
    const user = await User.findOneAndDelete({ clerkId });
    if (!user) {
      throw new Error("User not found");
    }

    //we need to delete all its questions and activites also
    //accesing user ques
    const userQuestionIds = await Questions.find({ author: user._id }).distinct(
      "_id"
    );

    //deleting
    await Questions.deleteMany({ author: user._id });

    const deletedUser = await User.findByIdAndDelete(user._id);

    return deleteUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getallUser(params: GetAllUsersParams) {
  try {
    connectDB();
    const { searchQuery, filter, page = 1, pageSize = 10 } = params;
    const skipAmt = (page - 1) * pageSize;

    const query: FilterQuery<typeof User> = {};

    if (searchQuery) {
      query.$or = [
        {
          name: { $regex: new RegExp(searchQuery, "i") },
        },
        {
          username: { $regex: new RegExp(searchQuery, "i") },
        },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "new_users":
        sortOptions = {
          createdAt: -1,
        };
        break;

      case "old_users":
        sortOptions = {
          createdAt: 1,
        };
        break;

      case "top_contributors":
        sortOptions = {
          reputation: -1,
        };
        break;

      default:
        break;
    }

    const user = await User.find(query)
      .sort(sortOptions)
      .skip(skipAmt)
      .limit(pageSize);
    const totalUsr = await User.countDocuments(query);
    const isNext = totalUsr > skipAmt + user.length;
    return { user, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function saveQue(params: ToggleSaveQuestionParams) {
  try {
    connectDB();
    const { userId, questionId, path } = params;
    const user = await User.findById(userId);
    if (!user) throw new Error("No user found");
    const isQueSaved = user.saved.includes(questionId);
    if (isQueSaved) {
      //remove the que
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true }
      );
    } else {
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionId } },
        { new: true }
      );
    }

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getSavedQue(params: GetSavedQuestionsParams) {
  connectDB();

  try {
    const { clerkId, page = 1, pageSize = 10, filter, searchQuery } = params;
    const query: FilterQuery<typeof Questions> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    let sortOptions = {};
    const skipAmt = (page - 1) * pageSize;

    switch (filter) {
      case "most_recent":
        sortOptions = {
          createdAt: -1,
        };
        break;

      case "oldest":
        sortOptions = {
          createdAt: 1,
        };
        break;

      case "most_voted":
        sortOptions = {
          upvoted: -1,
        };
        break;
      case "most_viewed":
        sortOptions = {
          views: -1,
        };
        break;
      case "most_answered":
        sortOptions = {
          answers: -1,
        };
        break;

      default:
        break;
    }
    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      model: Questions,
      match: query,
      options: {
        sort: sortOptions,
        skip: skipAmt,
        limit: pageSize,
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id name clerkId picture" },
      ],
    });

    if (!user) {
      throw new Error("No user found");
    }
    const questions = user.saved;
    const isNext = questions.length > pageSize;
    return { questions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserInfo(params: GetUserByIdParams) {
  try {
    connectDB();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      throw new Error("No user found");
    }
    const totalQue = await Questions.countDocuments({ author: user._id });
    const totalAns = await Answers.countDocuments({ author: user._id });

    // This JavaScript code snippet utilizes MongoDB aggregation to calculate the total number of upvotes for questions authored by a specific user. It filters documents by the user's ID, projects the size of the upvotes array for each document, and then groups the results to compute the total upvotes across all matched documents. The result is stored in the questionUpvotes constant.

    const [questionUpvotes] = await Questions.aggregate([
      { $match: { author: user._id } },
      {
        $project: {
          _id: 0,
          upvotes: { $size: "$upvotes" },
        },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);

    const [answerUpvotes] = await Answers.aggregate([
      { $match: { author: user._id } },
      {
        $project: {
          _id: 0,
          upvotes: { $size: "$upvotes" },
        },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: { $sum: "$upvotes" },
        },
      },
    ]);

    const [questionViews] = await Questions.aggregate([
      { $match: { author: user._id } },

      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" },
        },
      },
    ]);

    const criteria = [
      {
        type: "QUESTION_COUNT" as BadgeCriteriaType,
        count: totalQue,
      },
      {
        type: "ANSWER_COUNT" as BadgeCriteriaType,
        count: totalAns,
      },
      {
        type: "QUESTION_UPVOTES" as BadgeCriteriaType,
        count: questionUpvotes?.totalUpvotes || 0,
      },
      {
        type: "ANSWER_UPVOTES" as BadgeCriteriaType,
        count: answerUpvotes?.totalUpvotes || 0,
      },
      {
        type: "TOTAL_VIEWS" as BadgeCriteriaType,
        count: questionViews?.totalViews || 0,
      },
    ];

    const BadgeCount = assignBadges({ criteria });

    return {
      user,
      totalAns,
      totalQue,
      BadgeCount,
      reputution: user.reputation,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserQue(params: GetUserStatsParams) {
  try {
    connectDB();
    const { userId, page = 1, pageSize = 20 } = params;
    const totalQue = await Questions.countDocuments({ author: userId });

    const userQue = await Questions.find({ author: userId })
      .sort({ views: -1, upvotes: -1, createdAt: -1 })
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({
        path: "author",
        model: User,
      });

    return { totalQue, questions: userQue };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserAns(params: GetUserStatsParams) {
  try {
    connectDB();
    const { userId, page = 1, pageSize = 20 } = params;
    const totalAns = await Answers.countDocuments({ author: userId });

    const userAns = await Answers.find({ author: userId })
      .sort({ upvotes: -1, createdAt: -1 })
      .populate({
        path: "author",
        model: User,
      });

    return { totalAns, Answers: userAns };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
