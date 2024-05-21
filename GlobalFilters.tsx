"use client";
import React, { useState } from "react";
import { GlobalSearchFilters } from "./constants/filters";
import { Button } from "./components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { formURLquery } from "./lib/utils";

const GlobalFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeparams = searchParams.get("type");

  const [active, setactive] = useState(typeparams || "");

  const handleType=(type:string)=>{

    if (active === type) {
        setactive("");
        const newUrl = formURLquery({
          params: searchParams.toString(),
          key: "type",
          value: null,
        });
        router.push(newUrl, { scroll: false });
      } else {
        setactive(type);
        const newUrl = formURLquery({
          params: searchParams.toString(),
          key: "type",
          value: type.toLowerCase(),
        });
        router.push(newUrl, { scroll: false });
      }
  }

  return (
    <div className="flex items-center gap-5 px-5">
      <p className=" text-dark400_light500 body-medium ">Type :</p>
      <div className="flex gap-3">
        {GlobalSearchFilters.map((item) => (
          <Button
            key={item.value}
            className={`small-medium light-border border rounded-2xl px-5 py-2 capitalize text-dark400_light500 hover:text-primary-500
            ${active===item.value?'bg-primary-500 text-light-900':'bg-light-700 text-dark-400 hover:text-primary-500 dark:text-light-800  dark:bg-dark-500'}
            `}

            onClick={()=>handleType(item.value)}
          >
            {item.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default GlobalFilters;
