import { Document, Schema, model, models } from "mongoose";

export interface IQuestion extends Document {
  title: string;
  content: string;
  tags: Schema.Types.ObjectId[];
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  answers: Schema.Types.ObjectId[];
  authors: Schema.Types.ObjectId[];
  createdAt: Date;
  views: number;
}

const QueSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tags" }],
  upvotes: { type: Schema.Types.ObjectId, ref: "User" },
  downvotes: { type: Schema.Types.ObjectId, ref: "User" },
  answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
  author: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const Questions = models.Questions || model<IQuestion>("Questions", QueSchema);

export default Questions;
