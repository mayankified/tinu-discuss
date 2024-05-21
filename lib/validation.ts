import { z } from "zod";

export const questionSchema = z.object({
  title: z.string().min(5).max(130),
  tags: z.array(z.string().min(1).max(15)).min(1).max(3),
  explanation: z.string().min(100),
});

export const answerSchema = z.object({
  answer: z.string().min(10),
});

export const ProfileSchema = z.object({
  name: z.string().min(2).max(50),
  username: z.string().min(5).max(50), // Add username field to schema
  url: z.string().optional(),
  location: z.string().min(5).max(50), // Assume location is optional
  bio: z.string().min(10).max(100), // Assume bio is optional
});
