import LeftSidebar from "@/components/shared/LeftSidebar";
import Navbar from "@/components/shared/Navbar/Navbar";
import Rightsidebar from "@/components/shared/Rightsidebar";
import { Toaster } from "@/components/ui/toaster";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="background-light850_dark100 relative">
      <Navbar />
      <div className="flex justify-between ">
        <LeftSidebar />
        <section className="flex flex-col min-h-screen px-6 pb-6 pt-36 max-md:pb-14 sm:px-14 flex-1  ">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </section>
        <Rightsidebar />
      </div>
      <Toaster />
    </main>
  );
};

export default Layout;
