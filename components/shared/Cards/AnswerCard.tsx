import Link from "next/link";
import React from "react";
import Shreya from "../Shreya";
import { formatNumber, getTimestamps } from "@/lib/utils";
import parse from "html-react-parser";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../EditDeleteAction";

interface Props {
  _id: string;
  clerkId: string;
  content: string;
  author: {
    _id: string;
    name: string;
    img: string;
  };
  createdAt: Date;
  upvotes: number;
  question: string;
}

const AnswerCard = ({
  _id,
  author,
  createdAt,
  question,
  content,
  upvotes,
  clerkId,
}: Props) => {
  //@ts-ignore
  const showactionButton = clerkId && clerkId === author.clerkId;

  return (
    // <Link
    //   href={`/question/${JSON.parse(question)}`}
    //   className="card-wrapper p-9 sm:px-11 rounded-[10px]"
    // >
    //   <div className=" flex flex-col-reverse justify-between items-start gap-5 sm:flex-row">
    //     <div>
    //       <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
    //         {getTimestamps(createdAt)}
    //       </span>
    //       <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
    //         {content}
    //       </h3>
    //     </div>
    //   </div>

    //   <div className="flex flex-wrap justify-between gap-3 mt-6 w-full">
    //     <Shreya
    //       imgUrl="/assets/icons/avatar.svg"
    //       alt="user"
    //       value={author.name}
    //       title={`- asked ${getTimestamps(createdAt)}`}
    //       textStyles="body-medium text-dark400_light700"
    //       isAuthor={true}
    //       href="/sd"
    //     />
    //     <Shreya
    //       imgUrl="/assets/icons/like.svg"
    //       alt="likes"
    //       value={formatNumber(upvotes)}
    //       title="Likes"
    //       textStyles="small-medium text-dark400_light800"
    //     />
    //   </div>
    // </Link>
    <div className="card-wrapper p-9 my-6 sm:px-11 rounded-[10px]">
      <div className=" flex flex-col-reverse justify-between items-start gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimestamps(createdAt)}
          </span>
          <Link href={`/question/${question}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {parse(content)}
            </h3>
          </Link>
        </div>
        <SignedIn>
          {showactionButton && (
            <EditDeleteAction type="answer" itemId={JSON.stringify(_id)} />
          )}
        </SignedIn>
      </div>

      <div className="flex flex-wrap justify-between gap-3 mt-6 w-full">
        <Shreya
          //@ts-ignore
          imgUrl={author.picture}
          alt="user"
          value={author.name}
          title={`- commented ${getTimestamps(createdAt)}`}
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
      </div>
    </div>
    // </Link>
  );
};

export default AnswerCard;
