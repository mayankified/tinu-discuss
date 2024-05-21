"use client";
import { Input } from "@/components/ui/input";
import { formURLquery, removeKeysfromQuery } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import GlobalResult from "../GlobalResult";

const GlobalSearch = () => {
  const pathname = usePathname();
  const SearchRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  const [Search, setSearch] = useState(query || "");
  const [open, setopen] = useState(false);

  useEffect(() => {
    const HandleoutsideClick = (event: any) => {
      if (
        SearchRef.current &&
        //@ts-ignore
        !SearchRef.current.contains(event.target)
      ) {
        setopen(false);
        setSearch("");
      }
    };
    setopen(false);
    document.addEventListener("click", HandleoutsideClick);

    return () => {
      document.removeEventListener("click", HandleoutsideClick);
    };
  }, [pathname]);
  useEffect(() => {
    const debounce = setTimeout(() => {
      if (Search) {
        const newUrl = formURLquery({
          params: searchParams.toString(),
          key: "global",
          value: Search,
        });
        router.push(newUrl, { scroll: false });
      } else if (query) {
        const newUrl = removeKeysfromQuery({
          params: searchParams.toString(),
          key: ["global", "type"],
        });
        router.push(newUrl, { scroll: false });
      }
    }, 300);
    return () => clearTimeout(debounce);
  }, [Search, router, searchParams, query]);

  return (
    <div
      ref={SearchRef}
      className="relative w-full max-w-[600px]  max-lg:hidden "
    >
      <div className="background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4 ">
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={24}
          height={24}
          className=" cursor-pointer"
        />
        <Input
          type="text"
          value={Search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!open) setopen(true);
            if (e.target.value === "" && open) setopen(false);
          }}
          placeholder="Search Globally"
          className="paragrapgh-regular no-focus  placeholder text-dark400_light700 background-light800_darkgradient border-none outline-none text-dark400_light700 "
        />
      </div>
      {open && <GlobalResult />}
    </div>
  );
};

export default GlobalSearch;
