"use client";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProfileSchema } from "@/lib/validation";
import { usePathname, useRouter } from "next/navigation";
import { updateUser } from "@/lib/actions/user.action";


interface Prop {
  clerkId: string;
  mongoUserId: string;
}

const Profile = ({ clerkId, mongoUserId }: Prop) => {
  const ParsedUser = JSON.parse(mongoUserId);
  const router = useRouter();
  const pathname = usePathname();

  const [submitting, setsubmitting] = useState(false);
  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: ParsedUser.name || "",
      username: ParsedUser.username || "",
      url: ParsedUser.portfolioLink || "",
      location: ParsedUser.location || "",
      bio: ParsedUser.bio || "",
    },
  });

  async function onSubmit(values: z.infer<typeof ProfileSchema>) {
    setsubmitting(true);
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      //call api

      await updateUser({
        clerkId: clerkId,
        updateData: {
          name: values.name,
          username: values.username,
          portfolioLink: values.url,
          location: values.location,
          bio: values.bio,
        },
        path: pathname,
      });
      router.back();
    } catch (error) {
    } finally {
      setsubmitting(false);
    }
  }
  return (
    <div>
      {" "}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-9 flex w-full gap-9 flex-col"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-3.5">
                <FormLabel>
                  Name <span className="text-primary-500">*</span>{" "}
                </FormLabel>
                <FormControl>
                  <Input
                    className="no-focus  paragraph-regular light-border-2 background-light700_dark300 min-h-[56px]"
                    placeholder="Your name"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="space-y-3.5">
                <FormLabel>
                  Username <span className="text-primary-500">*</span>{" "}
                </FormLabel>
                <FormControl>
                  <Input
                    className="no-focus  paragraph-regular light-border-2 background-light700_dark300 min-h-[56px]"
                    placeholder="your username"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="space-y-3.5">
                <FormLabel>Portfolio Link </FormLabel>
                <FormControl>
                  <Input
                    className="no-focus  paragraph-regular light-border-2 background-light700_dark300 min-h-[56px]"
                    placeholder="Portfolio URL"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="space-y-3.5">
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input
                    className="no-focus  paragraph-regular light-border-2 background-light700_dark300 min-h-[56px]"
                    placeholder="Where do you live?"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="space-y-3.5">
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    className="no-focus  paragraph-regular light-border-2 background-light700_dark300 min-h-[56px]"
                    placeholder="What's special about you?"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-7 flex justify-end">
            <Button
              type="submit"
              disabled={submitting}
              className="primary-gradient w-fit"
            >
              {submitting ? "Saving.." : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Profile;
