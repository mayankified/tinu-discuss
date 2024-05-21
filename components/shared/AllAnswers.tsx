import React from "react";
import Filters from "./Filters";
import { AnswerFilters } from "@/constants/filters";
import { getAnswer } from "@/lib/actions/answer.action";
import NoResult from "./NoResult";
import Link from "next/link";
import Image from "next/image";
import { getTimestamps } from "@/lib/utils";
import ParseHTML from "./ParseHTML";
import Votes from "./Votes";
interface Props {
  userId: string;
  questionId: string;
  totalAns: number;
  page?: number;
  filter?: string;
}
const AllAnswers = async ({
  userId,
  questionId,
  totalAns,
  page,
  filter,
}: Props) => {
  const Result = await getAnswer({
    questionId,
    page: page ? +page : 1,
    sortBy: filter,
  });
  return (
    <div className="mt-10 ">
      <div className=" flex justify-between items-center">
        <h3 className="primary-text-gradient">{totalAns} Answers</h3>
        <Filters filters={AnswerFilters} />
      </div>
      <div className="mt-10 flex flex-col w-full gap-6">
        {Result.answer.map((ans) => (
          <article key={ans._id} className="py-10 light-border border-b ">
            <div className="flex items-center justify-between">
              <div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:gap-2 sm:items-center w-full">
                <Link
                  className="flex gap-1 flex-1 items-start sm:items-center"
                  href={`/profile/${ans.author.clerkID}`}
                >
                  <Image
                    src={ans.author.picture}
                    width={18}
                    height={18}
                    alt="profile"
                    className="rounded-full object-cover max-sm:mt-0.5"
                  />
                  <div className=" flex flex-col sm:flex-row sm:items-center">
                    <p className="body-semibold text-dark300_light700">
                      {ans.author.name}
                    </p>
                    <p className="small-regular text-dark400_light500 my-0.5 line-clamp-1 ml-0.5">
                      answered {getTimestamps(ans.createdAt)}
                    </p>
                  </div>
                </Link>
                <div className="flex justify-end">
                  <Votes
                    type="answer"
                    itemId={JSON.stringify(ans._id)}
                    userId={JSON.stringify(userId)}
                    upvotes={ans.upvotes.length}
                    hasupVoted={ans.upvotes.includes(userId)}
                    downvotes={ans.downvotes.length}
                    hasdownVoted={ans.downvotes.includes(userId)}
                  />
                </div>
              </div>
            </div>
            <ParseHTML data={ans.content} />
          </article>
        ))}
      </div>
    </div>
  );
};

export default AllAnswers;
