import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectDB = async () => {
  mongoose.set("strictQuery", true);
  if (!process.env.MONGO_URI) return console.log("MONGO_URI missing !!");
  if (isConnected) return console.log("Database is already connected");

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "TinuDiscuss",
    });
    isConnected = true;
    console.log("DB Connected");
  } catch (error) {
    console.log("Connection failed" + error);
  }
};
