import Question from "@/components/forms/Question";
import { getQuestionbyId } from "@/lib/actions/question.action";
import { getUserbyId } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const page = async ({ params }: ParamsProps) => {
  const { userId } = auth();
  const User = await getUserbyId({ userId });
  const QueDetails = await getQuestionbyId({ questionId: params.id });
  return (
    <>
      <h1 className="text-dark100_light900 h1-bold">Edit Question</h1>
      <div className="mt-9">
        <Question
          type="edit"
            mongoUserId={JSON.stringify(User._id)}
            questionDetails={JSON.stringify(QueDetails)}
        />
      </div>
    </>
  );
};

export default page;
