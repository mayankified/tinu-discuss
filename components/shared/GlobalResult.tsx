"use client";
import React, { useEffect, useRef, useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import GlobalFilters from "@/GlobalFilters";
import { GlobalSearch } from "@/lib/actions/global.action";
const GlobalResult = () => {
  const searchParams = useSearchParams();
  const global = searchParams.get("global");
  const type = searchParams.get("type");
  const [loading, setloading] = useState(false);
  const [result, setresult] = useState([]);
  
  
  
  useEffect(() => {
    const fetchResult = async () => {
      setresult([]);
      setloading(true);
      try {
        const res = await GlobalSearch({ query: global, type });
        setresult(JSON.parse(res));
        console.log(result)
        console.log("hii")
      } catch (error) {
        console.log(error);
        throw error;
      } finally {
        setloading(false);
      }
    };
    
    if (global) fetchResult();
  }, [global, type]);
  
  const RenderLink = (type: string, id: string) => {
    switch (type) {
      case "question":
        return `/question/${id}`;
      case "answer":
        return `/question/${id}`;
      case "user":
        return `/profile/${id}`;
      case "question":
        return `/tags/${id}`;

      default:
        return "/";
    }
  };
  return (
    <div  className=" absolute bg-light-800 dark:bg-dark-400 shadow-sm w-full z-30 mt-3 top-20 py-5 rounded-xl ">
      <GlobalFilters />
      <div className="my-5 h-[1px] bg-light-700 dark:bg-dark-500/50 " />
      <div className="space-y-5">
        <p className="text-dark400_light900 paragraph-semibold px-5">
          Top Match
        </p>
        {loading ? (
          <div className="flex items-center flex-col px-5">
            <ReloadIcon className="my-2 h-10 w-10 text-primary-500 animate-spin" />
            <p className="text-dark200_light800 body-regular">
              Browsing the Database!
            </p>
          </div>
        ) : (
          <div className=" flex flex-col gap-2">
            {result.length > 0 ? (
              result.map((item: any, index: number) => (
                <Link
                  href={RenderLink(item.type, item.id)}
                  key={item.id + item.type + index}
                  className="flex w-full cursor-pointer items-start gap-3 px-5 py-2.5 hover:bg-light-700/50 hover:dark:bg-dark-500/50 "
                >
                  <Image
                    src={"/assets/icons/tag.svg"}
                    width={18}
                    height={18}
                    alt="tag"
                    className="invert-colors mt-1 object-contain"
                  />
                  <div className="flex flex-col">
                    <p className="text-dark200_light800 body-medium line-clamp-1 ">
                      {item.title}
                    </p>
                    <p className="text-light400_light500 small-medium mt-1 font-bold capitalize">
                      {item.type}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex items-center flex-col px-5">
                <p className="text-dark200_light800 body-regular px-5 py-2.5">
                  No Results Found!!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalResult;
