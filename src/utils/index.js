import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config({
  path: "./../.env",
});

export const db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error while connecting to MongoDB...", error);
  }
};
