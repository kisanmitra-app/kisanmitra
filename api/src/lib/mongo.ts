import { MongoClient } from "mongodb";
import { env } from "~/config";
import mongoose from "mongoose";

/**
 * MongoDB Client and Database Instance
 */
const client = new MongoClient(env.MONGO_URI);
export const db = client.db();

export const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    // Connect mongoose
    await mongoose.connect(env.MONGO_URI);
    console.log("Mongoose connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};
