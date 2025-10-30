import { Queue } from "bullmq";
import { CONSTS } from "~/config";
import { redis } from "~/lib/redis";

const inventorySummaryQueue = new Queue(CONSTS.QUEUES.INVENTORY_SUMMARY, {
  connection: redis,
});

export const inventorySummaryQueueHelpers = {
  /**
   * Schedule a daily inventory summary for a user at 8:00 AM
   * @param userId - The user ID to schedule inventory summary for
   */
  scheduleDailyUpdate: async (userId: string) => {
    await inventorySummaryQueue.add(
      CONSTS.JOBS.INVENTORY_SUMMARY,
      { userId },
      {
        repeat: {
          //   pattern: "0 8 * * *", // Cron expression: Every day at 8:00 AM
          // for dev purpose run every 30 seconds
          pattern: "*/30 * * * * *",
        },
        jobId: `inventory-summary-${userId}`, // Unique job ID to prevent duplicates
      }
    );
  },

  /**
   * Add a one-time job for inventory summary
   * @param userId - The user ID to generate summary for
   */
  addJob: async (userId: string) => {
    await inventorySummaryQueue.add(CONSTS.JOBS.INVENTORY_SUMMARY, { userId });
  },

  /**
   * Remove a scheduled inventory summary
   * @param userId - The user ID to remove the scheduled update for
   */
  removeScheduledUpdate: async (userId: string) => {
    const jobId = `inventory-summary-${userId}`;
    const job = await inventorySummaryQueue.getJob(jobId);
    if (job) {
      await job.remove();
    }
  },

  /**
   * Remove a specific job by job ID
   * @param jobId - The job ID to remove
   */
  removeJob: async (jobId: string) => {
    const job = await inventorySummaryQueue.getJob(jobId);
    if (job) {
      await job.remove();
    }
  },

  /**
   * Remove a repeatable job by key
   * @param key - The repeatable job key
   */
  removeRepeatableJob: async (key: string) => {
    await inventorySummaryQueue.removeJobScheduler(key);
  },
};
