import UserCard from "@/components/shared/Cards/UserCard";
import Filters from "@/components/shared/Filters";
import Pagination from "@/components/shared/Pagination";
import LocalSearch from "@/components/shared/Search/LocalSearch";
import { UserFilters } from "@/constants/filters";
import { getallUser } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";

const page = async ({ searchParams }: SearchParamsProps) => {
  const searchParam = searchParams || { q: '', filter: '', page: '1' };

  const result = await getallUser({
    searchQuery: searchParam.q, 
    filter: searchParam.filter,
    page: +searchParam.page || 1, // No need for conditional check here
  });

  return (
    <>
      <h1 className="text-dark100_light900 h1-bold">All Users</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/people"
          iconposition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for Friends"
          otherClasses="flex-1"
        />
        <Filters
          filters={UserFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <section className="mt-12 flex justify-center flex-wrap gap-4">
        {result.user.length > 0 ? (
          result.user.map((usr) => <UserCard key={usr.name} user={usr} />)
        ) : (
          <div className="paragraph-regular text-dark200_light800  mx-auto max-w-4xl text-center">
            <p>No users yet</p>
          </div>
        )}
      </section>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  );
};

export default page;
