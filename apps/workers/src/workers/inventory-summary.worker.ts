import { ICategory, Inventory, IProduct, Profile } from "@kisan-mitra/schemas";
import { Worker } from "bullmq";
import { CONSTS } from "~/config";
import { google, logger, redis } from "~/lib";
import { generateText } from "ai";
import { generateObject } from "ai";
import { z } from "zod";

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

    // step 4: a listed string, inventory id with its product name, category, quantiy available
    let summary: string = "";
    inventories.map((inventory) => {
      const product = inventory.product as IProduct;
      const category = product.category as ICategory;
      summary += `Inventory ID: ${inventory._id}, Product: ${product.name}, Category: ${category.name}, Quantity Available: ${inventory.quantity} (${product.unit})\n`;
    });

    console.log("Inventory Summary Data: ", summary);

    const address = `${city}, ${region}, ${country}`;
    console.log("Address: ", address);

    // step 5: geenrate prompt
    const prompt =
      "You are an expert inventory analyst. Based on the following inventory data, provide a concise summary highlighting key insights, trends, and recommendations for optimizing inventory management.\n\n" +
      +"Also the inventory is focued for a farmer located in " +
      address +
      ".\n\n" +
      "Inventory Data:\n" +
      summary +
      "\n\n" +
      "Please provide the summary in a structured format with bullet points for easy readability. with max 100 words in total, avoid greetings and sign off." +
      "\n\nAlso add two points based on data driven insights & local factors that could help improve crop yield and farm productivity.";

    console.log("Generated Prompt: ", prompt);

    // step 6: generate ai currated summary
    // const { text } = await generateText({
    //   model: google("gemini-2.5-flash"),
    //   prompt: prompt,
    // });

    // console.log(text);

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: z.object({
        recommendations: z
          .array(z.string())
          .min(2)
          .max(2)
          .describe(
            "Concise summary highlighting key insights, trends, and recommendations for optimizing inventory management"
          ),
        insights: z
          .array(z.string())
          .min(2)
          .max(2)
          .describe("Data driven insights & local factors recommendations"),
      }),
      prompt: prompt,
    }).catch((err: any) => {
      logger.error("Error generating inventory summary: ", err.message);
      throw err;
    });

    console.log("Generated Object: ", JSON.stringify(object, null, 2));
    // step 7: store the generate output on profile
    // ##TODO

    // step 8: low stock alert based on inventory summary
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
  },
  { connection: redis, concurrency: 10 }
);
