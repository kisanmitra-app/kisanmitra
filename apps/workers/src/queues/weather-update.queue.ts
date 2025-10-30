import { Queue } from "bullmq";
import { CONSTS } from "~/config";
import { redis } from "~/lib/redis";

const weatherUpdateQueue = new Queue(CONSTS.QUEUES.WEATHER_UPDATE, {
  connection: redis,
});

export const weatherUpdateQueueHelpers = {
  /**
   * Schedule a daily weather update for a user at 8:00 AM
   * @param userId - The user ID to schedule weather updates for
   */
  scheduleDailyUpdate: async (userId: string) => {
    await weatherUpdateQueue.add(
      CONSTS.JOBS.WEATHER_UPDATE,
      { userId },
      {
        repeat: {
          //   pattern: "0 8 * * *", // Cron expression: Every day at 8:00 AM
          // for dev purpose run every 30 seconds
          pattern: "*/30 * * * * *",
        },
        jobId: `weather-update-${userId}`, // Unique job ID to prevent duplicates
      }
    );
  },

  /**
   * Add a one-time weather update job for immediate execution
   * @param userId - The user ID to fetch weather for
   */
  addJob: async (userId: string) => {
    await weatherUpdateQueue.add(CONSTS.JOBS.WEATHER_UPDATE, { userId });
  },

  /**
   * Remove a scheduled weather update for a user
   * @param userId - The user ID to remove the scheduled update for
   */
  removeScheduledUpdate: async (userId: string) => {
    const jobId = `weather-update-${userId}`;
    const job = await weatherUpdateQueue.getJob(jobId);
    if (job) {
      await job.remove();
    }
  },

  /**
   * Remove a specific job by job ID
   * @param jobId - The job ID to remove
   */
  removeJob: async (jobId: string) => {
    const job = await weatherUpdateQueue.getJob(jobId);
    if (job) {
      await job.remove();
    }
  },

  /**
   * Remove a repeatable job by key
   * @param key - The repeatable job key
   */
  removeRepeatableJob: async (key: string) => {
    await weatherUpdateQueue.removeJobScheduler(key);
  },
};
