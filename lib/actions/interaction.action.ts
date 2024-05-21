"use server";

import Questions from "@/database/question.model";
import { connectDB } from "../mongoose";
import { ViewQuestionParams } from "./shared.types";
import Interaction from "@/database/interaction.model";

export async function viewQues(params: ViewQuestionParams) {
  try {
    connectDB();
    const { questionId, userId } = params;
    await Questions.findByIdAndUpdate(questionId, { $inc: { views: 1 } });
    if(userId){
        const existingInteraction=await Interaction.findOne({
            user:userId,
            action:"view",
            question:questionId,
        })
        if(existingInteraction){
            return console.log("Viewer have already viewed thi Answer")
        }
        await Interaction.create({
            user:userId,
            action:"view",
            question:questionId,
        })
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
