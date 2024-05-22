import Image from "next/image";
import Link from "next/link";
import React from "react";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Theme from "./Theme";
import MobileNav from "./MobileNav";
import GlobalSearch from "../Search/GlobalSearch";

const Navbar = () => {
  return (
    <nav className="flex fixed justify-between w-full z-50 background-light900_dark200 gap-5 p-6 shadow-light-300 dark:shadow-none">
      <Link href="/" className="flex items-center gap-1">
        <Image
          src="/assets/images/site-logo.svg"
          alt="TinuDiscuss"
          width={35}
          height={35}
        />
        <p className="h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900 max-xs:hidden">
          Tinu <span className="text-primary-500">Discuss</span>
        </p>
      </Link>
      <GlobalSearch />

      <div className="flex justify-between  gap-5">
        <Theme />

        <SignedIn>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-10 w-10",
              },
              variables: {
                colorPrimary: "#c82678",
              },
            }}
          />
        </SignedIn>
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
