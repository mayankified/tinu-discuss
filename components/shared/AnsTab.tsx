import { getUserAns } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";
import AnswerCard from "./Cards/AnswerCard";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const AnsTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUserAns({
    userId,
    page: 1,
    pageSize: 20,
  });
  return (
    <>
      {result.Answers.map((item) => {
        return (
          <AnswerCard
            key={item._id}
            _id={item._id}
            content={item.content}
            question={JSON.stringify(item.question)}
            author={item.author}
            upvotes={item.upvotes.length}
            createdAt={item.createdAt}
            clerkId={clerkId?clerkId:''}
          />
        );
      })}
    </>
  );
};

export default AnsTab;
