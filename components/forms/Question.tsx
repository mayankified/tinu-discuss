"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { questionSchema } from "@/lib/validation";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { CreateQue } from "@/lib/actions/question.action";
import { usePathname, useRouter } from "next/navigation";

const type: string = "create";

interface Props {
  mongoUserId: string;
}

const Question = ({ mongoUserId }: Props) => {
  const [submitting, setsubmitting] = useState(false);

  const editorRef = useRef(null);
  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: "",
      explanation: "",
      tags: [],
    },
  });

  const router = useRouter();
  const pathname = usePathname();
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof questionSchema>) {
    setsubmitting(true);
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    try {
      //call api
      //navigate to homepage
      await CreateQue({
        //@ts-ignore
        title: values.title,
        content: values.explanation,
        tags: values.tags,
        author: JSON.parse(mongoUserId),
        path:pathname
      });

      router.push("/");
    } catch (error) {
    } finally {
      setsubmitting(false);
    }
    console.log(values);
  }

  const handlekeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (e.key === "Enter" && field.name === "tags") {
      e.preventDefault();
      const taginput = e.target as HTMLInputElement;
      const tagvalue = taginput.value.trim();
      if (tagvalue.length > 15) {
        return form.setError("tags", {
          type: "required",
          message: "Tag must be under 15 characters",
        });
      }
      if (!field.value.includes(tagvalue as never)) {
        form.setValue("tags", [...field.value, tagvalue]);
        taginput.value = "";
        form.clearErrors("tags");
      } else {
        form.trigger();
      }
    }
  };
  const handleTagdelete = (tag: string, field: any) => {
    const newtags = field.value.filter((t: string) => t !== tag);
    form.setValue("tags", newtags);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-10 w-full"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3  w-full">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  className="background-light700_dark300 no-focus paragraph-regular text-dark300_light700 light-border-2 border min-h-[56px]"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Be kind and respectful while asking
              </FormDescription>
              <FormMessage className="text-red-800" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem className="flex gap-3 flex-col w-full">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                {" "}
                Detailed Explanantion of your Post{" "}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY}
                  //@ts-ignore
                  onInit={(_evt, editor) => (editorRef.current = editor)}
                  initialValue=""
                  onBlur={field.onBlur}
                  onEditorChange={(data) => field.onChange(data)}
                  init={{
                    height: 350,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "codesample",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                    ],
                    toolbar:
                      "undo redo | " +
                      "codesample | bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist ",
                    content_style:
                      "body { font-family:Inter,Arial,sans-serif; font-size:16px }",
                  }}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Lamba likh bsdk
              </FormDescription>
              <FormMessage className="text-red-800" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Tags<span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <>
                  <Input
                    className="background-light700_dark300 no-focus paragraph-regular text-dark300_light700 light-border-2 border min-h-[56px]"
                    placeholder="Add tags..."
                    onKeyDown={(e) => handlekeyDown(e, field)}
                  />
                  {field.value.length > 0 && (
                    <div className="flex justify-start mt-2.5 gap-2.5">
                      {field.value.map((tag: any) => (
                        <Badge
                          key={tag}
                          className="subtle-medium background-light800_dark300
                        text-light400_light500
                        flex justify-center items-center gap-2 rounded-md px-4 py-2 capitalize border-none"
                          onClick={() => handleTagdelete(tag, field)}
                        >
                          {tag}
                          <Image
                            src="/assets/icons/close.svg"
                            alt="close"
                            width={12}
                            height={12}
                            className="cursor-pointer object-contain invert-0"
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                ADD upto 3 tags ..press enter to add a tag
              </FormDescription>
              <FormMessage className="text-red-800" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="primary-gradient !text-light-900 w-fit"
          disabled={submitting}
        >
          {submitting ? (
            <>{type === "edit" ? "Editing..." : "Posting..."}</>
          ) : (
            <>{type === "edit" ? "Edit Question" : "Ask a Question"}</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default Question;
