import { MongoClient } from "mongodb";
import { env } from "~/config";

/**
 * MongoDB Client and Database Instance
 */
const client = new MongoClient(env.MONGO_URI);
export const db = client.db();
