import Link from "next/link";
import React from "react";
import RenderTag from "../RenderTag";
import Shreya from "../Shreya";
import { formatNumber, getTimestamps } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../EditDeleteAction";
import Image from "next/image";

interface Props {
  _id: string;
  clerkId: string;
  title: string;
  author: {
    _id: string;
    name: string;
    img: string;
  };
  createdAt: Date;
  upvotes: number;
  views: number;
  tags: {
    name: string;
    _id: string;
  }[];
  answers: Array<object>;
}

const QuestionCard = ({
  _id,
  title,
  author,
  createdAt,
  clerkId,
  upvotes,
  answers,
  views,
  tags,
}: Props) => {
  //@ts-ignore
  const showactionButton = clerkId && clerkId === author.clerkId;

  return (
    <div className="card-wrapper p-9 sm:px-11 my-6 rounded-[10px]">
      <div className=" flex flex-col-reverse justify-between items-start gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimestamps(createdAt)}
          </span>
          <Link href={`/question/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>
        <SignedIn>
          {showactionButton && (
            <EditDeleteAction type="question" itemId={JSON.stringify(_id)} />
          )}
        </SignedIn>
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((item) => (
          <RenderTag key={item._id} _id={item._id} name={item.name} />
        ))}
      </div>
      <div className="flex flex-wrap justify-between gap-3 mt-6 w-full">
        <Shreya
          //@ts-ignore
          imgUrl={author.picture}
          alt="user"
          value={author.name}
          title={`- asked ${getTimestamps(createdAt)}`}
          textStyles="body-medium text-dark400_light700"
          isAuthor={true}
          //@ts-ignore
          href={`/profile/${author.clerkId}`}
        />
        <Shreya
          imgUrl="/assets/icons/like.svg"
          alt="likes"
          value={formatNumber(upvotes)}
          title="Likes"
          textStyles="small-medium text-dark400_light800"
        />
        <Shreya
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={answers.length}
          title="Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Shreya
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatNumber(views)}
          title="Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
    </div>
  );
};

export default QuestionCard;
