import {
  ICategory,
  Inventory,
  IProduct,
  Profile,
  Usage,
  IUsage,
} from "@kisan-mitra/schemas";
import { Worker } from "bullmq";
import { CONSTS } from "~/config";
import { google, logger, redis } from "~/lib";
import { generateText } from "ai";
import { generateObject } from "ai";
import { z } from "zod";

// Helper function to determine season based on month and region
function getSeason(month: number, region: string): string {
  const isNorthernHemisphere =
    !region.toLowerCase().includes("australia") &&
    !region.toLowerCase().includes("new zealand") &&
    !region.toLowerCase().includes("south africa") &&
    !region.toLowerCase().includes("argentina") &&
    !region.toLowerCase().includes("chile");

  if (isNorthernHemisphere) {
    if (month >= 2 && month <= 4) return "Spring";
    if (month >= 5 && month <= 7) return "Summer";
    if (month >= 8 && month <= 10) return "Fall/Autumn";
    return "Winter";
  } else {
    if (month >= 2 && month <= 4) return "Fall/Autumn";
    if (month >= 5 && month <= 7) return "Winter";
    if (month >= 8 && month <= 10) return "Spring";
    return "Summer";
  }
}

export const inventorySummaryWorker = new Worker(
  CONSTS.QUEUES.INVENTORY_SUMMARY,
  async (job: { data: { userId: string } }) => {
    const { userId } = job.data;
    logger.info(`generating summary for user: ${userId}`);

    // step 1: get profile data from DB
    const profile = await Profile.findOne({ user: userId });
    if (!profile) {
      throw new Error(`Profile not found for userId: ${userId}`);
    }

    // step 2: get address
    const { city, country, region } = profile.address;

    // step 3: get inventory summary
    const inventories = await Inventory.find({ user: userId }).populate([
      { path: "product", populate: [{ path: "category" }] },
    ]);

    // step 3.5: get usage history for crop cycle analysis (last 12 months)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const usageHistory = await Usage.find({
      user: userId,
      usedOn: { $gte: oneYearAgo },
    })
      .populate([
        {
          path: "inventory",
          populate: [{ path: "product", populate: [{ path: "category" }] }],
        },
      ])
      .sort({ usedOn: -1 });

    // step 4: a listed string, inventory id with its product name, category, quantiy available
    let summary: string = "";
    inventories.map((inventory) => {
      const product = inventory.product as IProduct;
      const category = product.category as ICategory;
      summary += `Inventory ID: ${inventory._id}, Product: ${product.name}, Category: ${category.name}, Quantity Available: ${inventory.quantity} (${product.unit})\n`;
    });

    // step 4.5: prepare usage history summary for crop cycle insights
    let usageSummary: string = "";
    const cropUsageMap = new Map<
      string,
      { totalUsed: number; occurrences: number; months: Set<number> }
    >();

    usageHistory.forEach((usage) => {
      const inventory = usage.inventory as any;
      const product = inventory?.product as IProduct;
      const usageDate = new Date(usage.usedOn);
      const month = usageDate.getMonth();
      const monthName = usageDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

      usageSummary += `${monthName}: ${product?.name || "Unknown"} - ${
        usage.quantityUsed
      } ${product?.unit || "units"}`;
      if (usage.crop) usageSummary += ` (Crop: ${usage.crop})`;
      if (usage.purpose) usageSummary += ` [${usage.purpose}]`;
      usageSummary += "\n";

      // Track crop-specific usage patterns
      if (usage.crop && product?.name) {
        const key = `${usage.crop}-${product.name}`;
        if (!cropUsageMap.has(key)) {
          cropUsageMap.set(key, {
            totalUsed: 0,
            occurrences: 0,
            months: new Set(),
          });
        }
        const data = cropUsageMap.get(key)!;
        data.totalUsed += usage.quantityUsed;
        data.occurrences += 1;
        data.months.add(month);
      }
    });

    // Get current season context
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    const currentSeason = getSeason(
      currentDate.getMonth(),
      region || "unknown"
    );

    const address = `${city}, ${region}, ${country}`;

    // step 5: geenrate prompt
    const prompt =
      `You are an expert agricultural inventory analyst and crop planning specialist. Analyze the following data to provide predictive inventory planning recommendations based on crop cycles and seasonal demand forecasting.\n\n` +
      `CURRENT CONTEXT:\n` +
      `- Date: ${currentMonth}\n` +
      `- Season: ${currentSeason}\n` +
      `- Location: ${address}\n\n` +
      `CURRENT INVENTORY DATA:\n${summary}\n` +
      `USAGE HISTORY (Past 12 Months):\n${
        usageSummary || "No usage history available"
      }\n\n` +
      `ANALYSIS REQUIREMENTS:\n` +
      `1. Identify seasonal patterns in inventory usage based on historical data\n` +
      `2. Predict upcoming demand based on crop cycles typical for ${region}, ${country}\n` +
      `3. Recommend optimal inventory levels for the next 3-6 months considering:\n` +
      `   - Current season (${currentSeason}) and upcoming seasonal transitions\n` +
      `   - Historical usage patterns and crop-specific needs\n` +
      `   - Regional agricultural calendar and planting/harvesting cycles\n` +
      `   - Weather patterns typical for this location and time of year\n` +
      `4. Suggest procurement timing to align with crop cycles and avoid stockouts\n` +
      `5. Identify items that may have seasonal demand spikes or drops\n` +
      `6. Provide data-driven insights on local farming practices that could improve yield and productivity\n\n` +
      `Please provide actionable, specific recommendations with quantities and timeframes where possible.`;

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: z.object({
        seasonalForecasts: z
          .array(
            z.object({
              period: z
                .string()
                .describe(
                  "Time period (e.g., 'Next 3 months', 'December-February')"
                ),
              expectedDemand: z
                .string()
                .describe("Predicted demand changes for this period"),
              suggestedActions: z
                .array(z.string())
                .describe("Specific actions to take during this period"),
            })
          )
          .describe(
            "Seasonal demand forecasts and predictions for upcoming periods"
          ),
        cropCycleInsights: z
          .array(
            z.object({
              crop: z.string().describe("Crop name or type"),
              cycle: z
                .string()
                .describe("Typical crop cycle information for the region"),
              inventoryNeeds: z
                .array(z.string())
                .describe("Inventory items needed for this crop cycle"),
            })
          )
          .describe("Crop cycle analysis and related inventory planning"),
        procurementPlan: z
          .array(
            z.object({
              item: z.string().describe("Inventory item name"),
              currentQuantity: z.string().describe("Current stock level"),
              recommendedQuantity: z
                .string()
                .describe("Recommended stock level"),
              timing: z
                .string()
                .describe(
                  "When to procure (e.g., 'Within 2 weeks', 'Before December')"
                ),
              rationale: z
                .string()
                .describe("Why this procurement is recommended"),
            })
          )
          .describe(
            "Specific procurement recommendations with quantities and timing"
          ),
        yieldImprovementTips: z
          .array(z.string())
          .describe(
            "Data-driven insights and local farming practices to improve crop yield and productivity"
          ),
      }),
      prompt: prompt,
    }).catch((err: any) => {
      logger.error("Error generating inventory summary: ", err.message);
      throw err;
    });

    // step 6: low stock alert based on inventory summary
    const lowStockItems = inventories.filter(
      (inventory) => inventory.quantity < 10
    );
    if (lowStockItems.length > 0) {
      // notify via fcm
      const productNames = lowStockItems
        .map((item) => {
          const product = item.product as IProduct;
          return product.name;
        })
        .join(", ");

      logger.info(`Low stock for ${productNames}`);
    }

    // step 7: update the profile
    profile.aiInventorySummary = object;
    await profile.save();

    return { success: true };
  },
  { connection: redis, concurrency: 10 }
);
