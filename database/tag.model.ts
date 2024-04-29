import { Document, Schema, model, models } from "mongoose";

// Define the schema for the main entity (e.g., a tag)
export interface ITag extends Document {
  name: string;
  description: string;
  questions: Schema.Types.ObjectId[];
  followers: Schema.Types.ObjectId[];
  createdOn: Date;
}

// Define the Mongoose schema for the main entity
const TagSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  questions: [{ type: Schema.Types.ObjectId, ref: "Question" }], // Assuming 'Question' is the model name for questions
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }], // Assuming 'User' is the model name for users
  createdOn: { type: Date, default: Date.now },
});

// Define and export the Mongoose model
const Tag = models.Tag || model("Tag", TagSchema);
export default Tag;
