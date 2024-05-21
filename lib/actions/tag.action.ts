"use server";

import User from "@/database/user.model";
import { connectDB } from "../mongoose";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import Tag, { ITag } from "@/database/tag.model";
import { FilterQuery } from "mongoose";
import Questions from "@/database/question.model";

export async function getUserTags(params: GetTopInteractedTagsParams) {
  try {
    connectDB();
    const { limit, userId } = params;
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    //will add interaction model

    return [
      { name: "tag1", _id: 1 },
      { name: "tag2", _id: 2 },
      { name: "tag3", _id: 3 },
    ];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectDB();
    const { searchQuery, filter,page = 1, pageSize = 10 } = params;
    const query: FilterQuery<typeof User> = {};
    const skipAmt = (page - 1) * pageSize;

    if (searchQuery) {
      query.$or = [
        {
          name: { $regex: new RegExp(searchQuery, "i") },
        },
      ];
    }
    let sortOptions = {};
    switch (filter) {
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };

        break;
      case "popular":
        sortOptions = { questions: -1 };

        break;
      case "name":
        sortOptions = { name: -1 };

        break;

      default:
        break;
    }
    const tags = await Tag.find(query).sort(sortOptions).skip(skipAmt)
    .limit(pageSize);
    const totaltag = await Tag.countDocuments(query);
    const isNext = totaltag > (skipAmt + tags.length);
    return { tags ,isNext};
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuesbyTags(params: GetQuestionsByTagIdParams) {
  try {
    connectDB();
    const { tagId, page = 1, pageSize = 20, searchQuery } = params;
    const tagFilter: FilterQuery<ITag> = { _id: tagId };
    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Questions,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        sort: {
          createdAt: -1,
        },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id name clerkId picture" },
      ],
    });
    if (!tag) {
      throw new Error("Tag not found");
    }
    const questions = tag.questions;
    return { tagTilte: tag.name, questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getTopTags() {
  try {
    connectDB();
    const popTags = await Tag.aggregate([
      {
        $project: {
          name: 1,
          numQue: { $size: "$questions" },
        },
      },
      { $sort: { numQue: -1 } },
      { $limit: 5 },
    ]);
    return popTags;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
