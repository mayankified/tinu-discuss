import Answer from "@/components/forms/Answer";
import AllAnswers from "@/components/shared/AllAnswers";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import Shreya from "@/components/shared/Shreya";
import Votes from "@/components/shared/Votes";
import { getQuestionbyId } from "@/lib/actions/question.action";
import { getUserbyId } from "@/lib/actions/user.action";
import { formatNumber, getTimestamps } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({ params,searchParams }: any) => {
  const result = await getQuestionbyId({ questionId: params.id });

  const { userId } = auth();

  if (!userId) redirect("/sign-in");
  const User = await getUserbyId({ userId });
  return (
    <>
      <div className=" flex justify-start flex-col w-full">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            className="flex items-center justify-start gap-1"
            href={`/profile/${result.author.clerkId}`}
          >
            <Image
              src={result.author.picture}
              className="rounded-full"
              alt="profile"
              width={22}
              height={22}
            />
            <p className="text-dark300_light700 paragraph-semibold">
              {result.author.name}
            </p>
            <p className="text-primary-500 paragraph-semibold">
             @ {result.author.username}
            </p>
          </Link>
          <div className="flex justify-end">
            <Votes
              type="question"
              itemId={JSON.stringify(result._id)}
              userId={JSON.stringify(User._id)}
              upvotes={result.upvotes.length}
              hasupVoted={result.upvotes.includes(User._id)}
              downvotes={result.downvotes.length}
              hasdownVoted={result.downvotes.includes(User._id)}
              hasSaved={User?.saved.includes(result._id)}
            />
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left ">
          {result.title}
        </h2>
      </div>
      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Shreya
          imgUrl="/assets/icons/clock.svg"
          alt="clock"
          value={`asked ${getTimestamps(result.createdAt)}`}
          title="Asked"
          textStyles="small-medium text-dark400_light800"
        />
        <Shreya
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={result.answers.length}
          title="Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Shreya
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatNumber(result.views)}
          title="Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
      <ParseHTML data={result.content} />
      <div className="mt-8 flex flex-wrap gap-2">
        {result.tags.map((item: any) => (
          <RenderTag
            key={item._id}
            _id={item._id}
            name={item.name}
            showCount={false}
          />
        ))}
      </div>

      <AllAnswers
        userId={User._id }
        questionId={result._id}
        totalAns={result.answers.length}
        page={searchParams?.page}
        filter={searchParams?.filter}
      />
      <Answer
        authorId={JSON.stringify(User._id)}
        question={result.content}
        questionId={JSON.stringify(result._id)}
      />
    </>
  );
};

export default page;
