import { Redis } from "ioredis";
import { env } from "~/config";
import { logger } from "./logger";

/**
 * @description Redis client instance
 */
export const redis = new Redis(env.REDIS_URI, {
  maxRetriesPerRequest: null,
});

/**
 * check redis connection
 */
export const checkRedisConnection = async () => {
  try {
    await redis.ping();
    logger.info("Redis connected");
  } catch (error: any) {
    logger.error(`Redis connection error: ${error?.message}`);
    process.exit(1);
  }
};
