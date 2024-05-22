import QuestionCard from "@/components/shared/Cards/QuestionCard";
import Filters from "@/components/shared/Filters";
import NoResult from "@/components/shared/NoResult";
import LocalSearch from "@/components/shared/Search/LocalSearch";
import { QuestionFilters } from "@/constants/filters";
import { getQuesbyTags } from "@/lib/actions/tag.action";
import { URLProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const page = async ({ params, searchParams }: URLProps) => {
  const result = await getQuesbyTags({
    tagId: params.id,
    page: 1,
    searchQuery: searchParams.q,
  });
  const { userId } = auth();

  return (
    <>
      <h1 className="text-dark100_light900 capitalize h1-bold">
        {result.tagTilte}
      </h1>
      <div className="mt-11 w-full">
        <LocalSearch
          route="/"
          iconposition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search Tag Questions"
          otherClasses="flex-1"
        />
      </div>
      <div className="mt-10 flex flex-col w-full gap-6">
        {result.questions.length > 0 ? (
          result.questions.map((item: any) => (
            <QuestionCard
              clerkId={userId || ""}
              key={item._id}
              _id={item._id}
              title={item.title}
              tags={item.tags}
              author={item.author}
              answers={item.answers}
              upvotes={item.upvotes?.length}
              createdAt={item.createdAt}
              views={item.views}
            />
          ))
        ) : (
          <NoResult
            title="There are no Tag questions To show"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, rerum maxime. Consectetur veritatis magni placeat aliquid iste nesciunt quaerat accusamus officia eos molestiae."
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
};

export default page;
