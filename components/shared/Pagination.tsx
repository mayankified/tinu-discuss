"use client";
import React from "react";
import { Button } from "../ui/button";
import { number } from "zod";
import { formURLquery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  pageNumber: number;
  isNext: Boolean;
}

const Pagination = ({ pageNumber, isNext }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const HnadleNav = (dirn: string) => {
    const nextPage = dirn === "prev" ? pageNumber - 1 : pageNumber + 1;
    const newUrl = formURLquery({
      params: searchParams.toString(),
      key: "page",
      value: nextPage.toString(),
    });
    router.push(newUrl);
  };
  if (!isNext && pageNumber === 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 w-full">
      <Button
        disabled={pageNumber === 1}
        onClick={() => HnadleNav("prev")}
        className="light-border-2 btn border flex min-h-[36px] items-center justify-center gap-2 "
      >
        <p className="body-medium text-dark200_light800  ">Prev</p>
      </Button>
      <div className="bg-primary-500 flex justify-center items-center rounded-md px-3.5 py-2">
        <p className="body-semibold text-light-900">{pageNumber}</p>
      </div>
      <Button
        disabled={!isNext}
        onClick={() => HnadleNav("next")}
        className="light-border-2 btn border flex min-h-[36px] items-center justify-center gap-2 "
      >
        <p className="body-medium text-dark200_light800  ">Next</p>
      </Button>
    </div>
  );
};

export default Pagination;
