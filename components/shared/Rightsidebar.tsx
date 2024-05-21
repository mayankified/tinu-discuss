import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "./RenderTag";
import { getHotQuestion } from "@/lib/actions/question.action";
import { getTopTags } from "@/lib/actions/tag.action";

// const TopQue = [
//   { _id: 1, title: "loremdsdsdsdas adsda" },
//   { _id: 2, title: "loremdsdsdsdas adsda" },
//   { _id: 3, title: "loremdsdsdsdas adsda" },
//   { _id: 4, title: "loremdsdsdsdas adsda" },
//   { _id: 5, title: "loremdsdsdsdas adsda" },
// ];
// const PopTags = [
//     { _id: 1, name: "richa love" ,totalQue:5 },
//     { _id: 2, name: "richa love" ,totalQue:5 },
//     { _id: 3, name: "richa love" ,totalQue:5 },
//     { _id: 4, name: "richa love" ,totalQue:5 },
//     { _id: 5, name: "richa love" ,totalQue:5 },
//   ];

const Rightsidebar =async () => {
  const TopQue=await getHotQuestion()
  const PopTags=await getTopTags()
  return (
    <section className="sticky custom-scrollbar top-0 right-0 flex flex-col h-screen overflow-y-auto background-light900_dark200 light-border border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden w-[350px] ">
      <div>
        <h3 className="text-dark200_light900 h3-bold">Top Questions</h3>
        <div className="mt-7 flex flex-col w-full gap-[30px]">
          {TopQue.map((que) => (
            <Link
              href={`/question/${que._id}`}
              key={que._id}
              className="flex cursor-pointer items-center justify-between gap-7"
            >
              <p className="body-medium text-dark500_light700">{que.title}</p>
              <Image
                src="/assets/icons/chevron-right.svg"
                alt="arrow"
                width={20}
                height={20}
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="text-dark200_light900 h3-bold">Popular Tags</h3>
        <div className="flex flex-col gap-4 mt-7">
          {
            PopTags.map((tag)=>(
                <RenderTag
                key={tag._id}
                _id={String(tag._id)}
                name={tag.name}
                totalQue={tag.numQue}
                showCount
                />
            ))
          }
        </div>
      </div>
    </section>
  );
};

export default Rightsidebar;
