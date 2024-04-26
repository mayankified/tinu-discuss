import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

interface Props {
  title: string;
  description: string;
  link: string;
  linkTitle: string;
}

const NoResult = ({ title, description, link, linkTitle }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center w-full mt-10">
      <Image
        src="/assets/images/light-illustration.png"
        width={270}
        height={200}
        alt="no result"
        className="block object-contain dark:hidden"
      />
      <Image
        src="/assets/images/dark-illustration.png"
        width={270}
        height={200}
        alt="no result"
        className="dark:block object-contain hidden"
      />
      <h2 className="h2-bold text-dark200_light900 mt-8">{title}</h2>
      <p className="body-regular text-dark500_light700 my-3.5 max-w-md">
        {description }
      </p>
      <Link href={link}>
        <Button className="py-4 px-3 paragraph-medium bg-primary-500 mt-5 min-h-[46px rounded-lg] text-light-900 hover:bg-primary-gradient">
          {linkTitle}
        </Button>
      </Link>
    </div>
  );
};

export default NoResult;
