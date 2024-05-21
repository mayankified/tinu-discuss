"use client";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { answerSchema } from "@/lib/validation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Editor } from "@tinymce/tinymce-react";
import { UseTheme } from "@/context/Themeprovider";
import { Button } from "../ui/button";
import Image from "next/image";
import { CreateAns } from "@/lib/actions/answer.action";
import { usePathname } from "next/navigation";

interface Props {
  authorId: string;
  question: string;
  questionId: string;
}

const Answer = ({ authorId, question, questionId }: Props) => {
  const pathname = usePathname();
  const editorRef = useRef(null);
  const [submitting, setsubmitting] = useState(false);

  const form = useForm<z.infer<typeof answerSchema>>({
    resolver: zodResolver(answerSchema),
    defaultValues: {
      answer: "",
    },
  });
  const { mode } = UseTheme();
  async function onSubmit(values: z.infer<typeof answerSchema>) {
    setsubmitting(true);

    try {
      //call api
      //navigate to homepage
      await CreateAns({
        //@ts-ignore
        content: values.answer,
        author: JSON.parse(authorId),
        question: JSON.parse(questionId),
        path: pathname,
      });
      form.reset;

      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent("");
      }
    } catch (error) {
    } finally {
      setsubmitting(false);
    }
  }

  return (
    <div>
      <div className=" flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold  text-dark400_light800">
          Write Your Answer here
        </h4>
      </div>

      <Form {...form}>
        <form
          action=""
          className="mt-6 gap-10 flex w-full flex-col"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex gap-3 flex-col w-full">
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
                      skin: mode === "dark" ? "oxide-dark" : "oxide",
                      content_css: mode === "dark" ? "dark" : "light",
                    }}
                  />
                </FormControl>
                <FormMessage className="text-red-800" />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              className="primary-gradient !text-light-900 w-fit"
              disabled={submitting}
            >
              {submitting ? "Submitting" : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Answer;
