import { MongoClient } from "mongodb";
import { env } from "~/config";
import mongoose from "mongoose";
import { logger } from "./logger";

/**
 * MongoDB Client and Database Instance
 */
const client = new MongoClient(env.MONGO_URI);
export const db = client.db();

export const connectToMongo = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info("MongoDB connected successfully");
  } catch (error: any) {
    logger.error(`Failed to connect to MongoDB: ${error.message}`);
    throw error;
  }
};
