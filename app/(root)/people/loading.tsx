import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const loading = () => {
  return (
    <section>
      <h1 className="text-dark100_light900 h1-bold">All Users</h1>

      <div className="mb-12  mt-11 flex flex-wrap gap-5 ">
        <Skeleton className="h-14 flex-1 bg-[#e6e6e6]" />
        <Skeleton className="h-14 w-28 bg-[#e6e6e6]" />
      </div>
      <div className="flex flex-wrap gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <Skeleton
            key={item}
            className="h-60 bg-[#e6e6e6] w-full rounded-2xl sm:w-[260px]"
          />
        ))}
      </div>
    </section>
  );
};

export default loading;
