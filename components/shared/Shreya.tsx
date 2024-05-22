import Image from "next/image";
import Link from "next/link";
import React from "react";
interface Props {
  imgUrl: string;
  alt: string;
  value: string | number;
  textStyles?: string;
  title: string;
  href?: string;
  isAuthor?: boolean;
}

const Shreya = ({
  imgUrl,
  alt,
  value,
  textStyles,
  title,
  href,
  isAuthor,
}: Props) => {
  const miniShreya = (
    <>
      <Image
        src={imgUrl}
        alt={alt}
        width={20}
        height={20}
        className={`object-cover mr-1 ${href ? "rounded-full" : ""}`}
      />
      <p className={`flex items-center gap-1 ${textStyles}`}>
        {value}
        <span
          className={`small-regular line-clamp-1 ${
            isAuthor ? "max-sm:hidden" : ""
          }`}
        >
          {title}
        </span>
      </p>
    </>
  );
  if(href){
    return(
        <Link href={href} className="flex justify-center flex-wrap gap-1">
        {miniShreya}
        </Link>
    )
  }
  return (
    <div className=" flex justify-center flex-wrap gap-1">
      {miniShreya} 
    </div>
  );
};

export default Shreya;
