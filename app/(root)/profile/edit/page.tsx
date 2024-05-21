import Profile from "@/components/forms/Profile";
import { getUserbyId } from "@/lib/actions/user.action";
import { ParamsProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const page = async () => {
  const { userId } = auth();
  if(!userId) return null;
  const User = await getUserbyId({ userId });
  return (
    <>
      <h1 className="text-dark100_light900 h1-bold">Edit Profile</h1>
      <div className="mt-9">
        <Profile clerkId={userId} mongoUserId={JSON.stringify(User)} />
      </div>
    </>
  );
};

export default page;
