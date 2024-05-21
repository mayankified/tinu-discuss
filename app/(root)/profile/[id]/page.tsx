import { Button } from "@/components/ui/button";
import { getUserInfo, getUserbyId } from "@/lib/actions/user.action";
import { URLProps } from "@/types";
import { SignedIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatMonthYear } from "@/lib/utils";
import ProfileLink from "@/components/shared/ProfileLink";
import Stats from "@/components/shared/Stats";
import QueTab from "@/components/shared/QueTab";
import AnsTab from "@/components/shared/AnsTab";

const page = async ({ params, searchParams }: URLProps) => {
  const { userId } = auth();
  const userInfo = await getUserInfo({ userId: params.id });
  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Image
            src={userInfo.user.picture}
            alt="profile"
            width={140}
            height={140}
            className="rounded-full object-cover aspect-square"
          />
          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">
              {userInfo.user.name}
            </h2>
            <h2 className="h3-bold  text-primary-500">
              @ {userInfo.user.username}
            </h2>
            <div className="mt-5 gap-5 flex flex-wrap items-center justify-start ">
              {userInfo.user.portfolioLink && (
                <ProfileLink
                  imgUrl="/assets/icons/link.svg"
                  href={userInfo.user.portfolioLink}
                  title="Portfolio"
                />
              )}
              {userInfo.user.location && (
                <ProfileLink
                  imgUrl="/assets/icons/location.svg"
                  title={userInfo.user.location}
                />
              )}
              <ProfileLink
                imgUrl="/assets/icons/calendar.svg"
                title={` Joined ${formatMonthYear(userInfo.user.createdAt)}`}
              />
            </div>
            {userInfo.user.bio && (
              <p className="paragraph-regular text-dark400_light700 mt-2">
                {userInfo.user.bio}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          <SignedIn>
            {userId === userInfo.user.clerkId && (
              <Link href={"/profile/edit"}>
                <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] min-w-[175px] px-4 py-3">
                  Edit Profile
                </Button>
              </Link>
            )}
          </SignedIn>
        </div>
      </div>
      <Stats
        reputation={userInfo.reputution}
        totalAns={userInfo.totalAns}
        badges={userInfo.BadgeCount}
        totalQue={userInfo.totalQue}
      />
      <div className="mt-10 flex gap-10">
        <Tabs defaultValue="top-posts" className="w-[400px] ">
          <TabsList className="background-light800_dark400 min-h-[42px] p-1">
            <TabsTrigger className="tab" value="top-posts">
              Top Posts
            </TabsTrigger>
            <TabsTrigger className="tab" value="answers">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="top-posts">
            <QueTab
              userId={userInfo.user._id}
              clerkId={userId}
              searchParams={searchParams}
            />
          </TabsContent>
          <TabsContent value="answers">
            <AnsTab
              userId={userInfo.user._id}
              clerkId={userId}
              searchParams={searchParams}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default page;
