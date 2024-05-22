import QuestionCard from "@/components/shared/Cards/QuestionCard";
import Filters from "@/components/shared/Filters";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearch from "@/components/shared/Search/LocalSearch";
import { QuestionFilters } from "@/constants/filters";
import { getSavedQue } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const Home = async ({ searchParams }: SearchParamsProps) => {
  const { userId } = auth();
  if (!userId) return null;
  const result = await getSavedQue({
    clerkId: userId,
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  });
  return (
    <>
      <h1 className="text-dark100_light900 h1-bold">Saved Questions</h1>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/"
          iconposition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for Questions"
          otherClasses="flex-1"
        />
        <Filters
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="max-md:flex hidden"
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
            title="There are no Saved questions To show"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Sed, rerum maxime. Consectetur veritatis magni placeat aliquid iste nesciunt quaerat accusamus officia eos molestiae."
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  );
};

export default Home;
