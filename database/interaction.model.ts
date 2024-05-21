import { Document, Schema, model, models } from "mongoose";

export interface IInteraction extends Document {
  user: Schema.Types.ObjectId;
  question: Schema.Types.ObjectId;
  action: string; // Define the possible actions as needed (e.g., "like", "dislike", "bookmark", etc.)
  answer: Schema.Types.ObjectId;
  createdAt: Date;
  tag: Schema.Types.ObjectId[];
}

const InteractionSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  question: { type: Schema.Types.ObjectId, ref: "Question" },
  action: { type: String, required: true },
  answer: { type: Schema.Types.ObjectId, ref: "Answer" },
  createdAt: { type: Date, default: Date.now },
  tag: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
});

// Define and export the Mongoose model
const Interaction =
  models.Interaction || model("Interaction", InteractionSchema);
export default Interaction;
