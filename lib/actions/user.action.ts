"use server";

import User from "@/database/user.model";
import { connectDB } from "../mongoose";

export async function getUserbyId(params: any) {
  try {
    connectDB();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });
    return user;
  } catch (error) {
    console.log(error)
  }
}
