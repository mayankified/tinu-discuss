"use server";

import Questions from "@/database/question.model";
import { connectDB } from "../mongoose";
import { SearchParams } from "./shared.types";
import User from "@/database/user.model";
import Tag from "@/database/tag.model";
import Answers from "@/database/answer.model";

export async function GlobalSearch(params: SearchParams) {
  const Searchtype = ["question", "answer", "user", "tag"];
  try {
    let results = [];
    await connectDB();
    const { query, type } = params;
    const regexQuery = { $regex: query, $options: "i" };
    const modelsandTypes = [
      {
        model: Questions,
        searchfield: "title",
        type: "question",
      },
      {
        model: User,
        searchfield: "name",
        type: "user",
      },
      {
        model: Tag,
        searchfield: "name",
        type: "tag",
      },
      {
        model: Answers,
        searchfield: "content",
        type: "answer",
      },
    ];
    const typeLower = type?.toLowerCase();
    if (!typeLower || !Searchtype.includes(typeLower)) {
      //search all
      for (const { model, type, searchfield } of modelsandTypes) {
        const QueryResult = await model
          .find({ [searchfield]: regexQuery })
          .limit(2);

        results.push(
          ...QueryResult.map((item) => ({
            title:
              type === "answer"
                ? `Answers containing ${query}`
                : item[searchfield],
            type,
            id:
              type === "user"
                ? item.clerkId
                : type === "answer"
                ? item.question
                : item.id,
          }))
        );
      }
    } else {
      //search in particular model

      const modelInfo = modelsandTypes.find((e) => e.type === typeLower);
      if (!modelInfo) {
        throw new Error("invalid Search");
      }
      const QueryResult = await modelInfo.model
        .find({
          [modelInfo.searchfield]: regexQuery,
        })
        .limit(8);
      results = QueryResult.map((item) => ({
        title:
          type === "answer"
            ? `Answers containing ${query}`
            : item[modelInfo.searchfield],
        type,
        id:
          type === "user"
            ? item.clerkId
            : type === "answer"
            ? item.question
            : item.id,
      }));
    }
    console.log(results)
    return JSON.stringify(results);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
