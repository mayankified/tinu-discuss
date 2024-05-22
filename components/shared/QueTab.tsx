import { getUserQue } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";
import QuestionCard from "./Cards/QuestionCard";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const QueTab = async ({ searchParams, userId, clerkId }: Props) => {
  const result = await getUserQue({
    userId,
    page: 1,
    pageSize: 20,
  });

  return (
    <>
      {result.questions.map((item) => (
        <QuestionCard
          key={item._id}
          _id={item._id}
          title={item.title}
          tags={item.tags}
          clerkId={clerkId ? clerkId : ""}
          author={item.author}
          answers={item.answers}
          upvotes={item.upvotes.length}
          createdAt={item.createdAt}
          views={item.views}
        />
      ))}
    </>
  );
};

export default QueTab;
