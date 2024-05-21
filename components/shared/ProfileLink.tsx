import Image from "next/image";
import Link from "next/link";
import React from "react";
interface Props {
  imgUrl: string;
  href?: string;
  title: string;
}
const ProfileLink = ({ imgUrl, href, title }: Props) => {
  return <div className=" flex items-center gap-1">
    <Image
    src={imgUrl}
    alt="icon"
    width={20}
    height={20}
    />
    {
        href?(
            <Link href={href} className="text-accent-blue paragraph-medium" target="_blank">
                {title}
            </Link>
        ):(
            <p className="paragraph-medium text-dark400_light700">
                {title}
            </p>
        )
    }
  </div>;
};

export default ProfileLink;
