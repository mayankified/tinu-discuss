import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const loading = () => {
  return (
    <div className="flex items-start flex-col justify-between ">
      <div className="flex flex-col items-start gap-4 lg:flex-row">
        <Skeleton className="bg-[#e6e6e6] rounded-full object-cover aspect-square w-[140px] h-[140px]" />
        <div className="mt-3">
          <Skeleton className="bg-[#e6e6e6] h-[28px] w-[200px] mb-2" />
          <Skeleton className="bg-[#e6e6e6] h-[24px] w-[150px] mb-5" />
          <div className="mt-5 gap-5 flex flex-wrap items-center justify-start">
            <Skeleton className="bg-[#e6e6e6] h-[24px] w-[100px] mb-2" />
            <Skeleton className="bg-[#e6e6e6] h-[24px] w-[100px] mb-2" />
            <Skeleton className="bg-[#e6e6e6] h-[24px] w-[100px] mb-2" />
          </div>
          <Skeleton className="bg-[#e6e6e6] paragraph-regular text-dark400_light700 mt-2 h-[16px] w-[300px]" />
        </div>
      </div>
      {/* <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
        <Skeleton className="bg-[#e6e6e6] paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3" />
      </div> */}
      <div className="w-full mt-10">
        <Skeleton className="bg-[#e6e6e6] h-[50px] w-[100%] mb-2" />
        <div className="mt-10 flex gap-10">
          <Skeleton className="bg-[#e6e6e6] h-[42px] w-[100px] mb-2" />
          <Skeleton className="bg-[#e6e6e6] h-[42px] w-[100px] mb-2" />
        </div>
        <div className="mt-10">
          <Skeleton className="bg-[#e6e6e6] h-[300px] w-[100%] mb-2" />
        </div>
      </div>
    </div>
  );
};

export default loading;
