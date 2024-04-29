import Question from "@/components/forms/Question";
import { getUserbyId } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const Askque = async () => {
  // const userId = auth();
  const userId = 'CL123';

  if (!userId) redirect("/sign-in");

  const User = await getUserbyId({ userId });

  console.log(User)
  return (
    <div>
      <h1 className="text-dark100_light900 h1-bold">Ask a Question</h1>
      <div className="mt-9">
        <Question mongoUserId={JSON.stringify(User._id)} />
      </div>
    </div>
  );
};

export default Askque;
