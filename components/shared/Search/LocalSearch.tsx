"use client";
import { Input } from "@/components/ui/input";
import { formURLquery, removeKeysfromQuery } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
interface Custominputprops {
  route: string;
  iconposition: string;
  placeholder: string;
  imgSrc: string;
  otherClasses: string;
}
const LocalSearch = ({
  route,
  iconposition,
  placeholder,
  imgSrc,
  otherClasses,
}: Custominputprops) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const [Search, setSearch] = useState(query || "");
  useEffect(() => {
    const debounce = setTimeout(() => {
      if (Search) {
        const newUrl = formURLquery({
          params: searchParams.toString(),
          key: "q",
          value: Search,
        });
        router.push(newUrl, { scroll: false });
      } else if (pathname === route) {
        const newUrl = removeKeysfromQuery({
          params: searchParams.toString(),
          key: ["q"],
        });
        router.push(newUrl, { scroll: false });
      }
    }, 300);
    return () => clearTimeout(debounce);
  }, [Search, router,route, searchParams, query,pathname]);

  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses} `}
    >
      {iconposition === "left" && (
        <Image
          src={imgSrc}
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        value={Search}
        onChange={(e) => setSearch(e.target.value)}
        className=" no-focus focus-visible:ring-0 focus-visible:ring-transparent paragraph-regular placeholder text-dark400_light700 background-light800_darkgradient border-none shadow-none outline-none"
      />
      {iconposition === "right" && (
        <Image
          src={imgSrc}
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default LocalSearch;
