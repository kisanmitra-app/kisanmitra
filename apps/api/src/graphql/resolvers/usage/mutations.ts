import { IGraphQLContext } from "~/types";
import { ICreateUsageInput } from "./types";
import { Inventory, Usage } from "@kisan-mitra/schemas";

export const Mutation = {
  createUsage: async (
    _: any,
    { input }: { input: ICreateUsageInput },
    context: IGraphQLContext
  ) => {
    const user = context.get("user");

    console.log("Creating usage with input:", input);

    const inventory = await Inventory.findById(input.inventoryId);
    if (!inventory) {
      throw new Error("Inventory not found");
    }

    console.log("Found inventory:", inventory);

    const usage = await Usage.create({
      inventory: inventory._id,
      quantityUsed: input.quantityUsed,
      user: user?.id,
      usedOn: input.usedOn,
      crop: input.crop,
      field: input.field,
      purpose: input.purpose,
      notes: input.notes,
    });

    console.log("Created usage:", usage);

    await usage.save();

    // Update inventory quantity
    inventory.quantity -= input.quantityUsed;
    await inventory.save();

    await usage.populate([
      "user",
      {
        path: "inventory",
        populate: [
          { path: "user" },
          {
            path: "product",
            populate: [
              { path: "user" },
              { path: "category", populate: { path: "user" } },
            ],
          },
        ],
      },
    ]);

    return usage;
  },
};
