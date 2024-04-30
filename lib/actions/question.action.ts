"use server";

import Questions from "@/database/question.model";
import { connectDB } from "../mongoose";
import Tag from "@/database/tag.model";
import { CreateQuestionParams, GetQuestionsParams } from "./shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";

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
          $push: { question: question._id },
        },
        { upsert: true, new: true }
      );
      tagDoc.push(existingTag._id);
    }
    await Questions.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDoc } },
    });

    revalidatePath(path);
  } catch (error) {}
}

export async function getQuestion(params: GetQuestionsParams) {
  try {
    connectDB();
    const questions = await Questions.find({})
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({
        path: "author",
        model: User,
      })
      .sort({ createdAt: -1 });

    return { questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
