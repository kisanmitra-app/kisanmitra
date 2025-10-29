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

    const inventory = await Inventory.findById(input.inventoryId);
    if (!inventory) {
      throw new Error("Inventory not found");
    }

    // check if enough quantity is available
    if (inventory.quantity < input.quantityUsed) {
      throw new Error("Insufficient inventory quantity");
    }

    const usage = await Usage.create({
      inventory: inventory._id,
      quantityUsed: input.quantityUsed,
      user: user?.id,
      usedOn: new Date(input.usedOn),
      crop: input.crop,
      field: input.field,
      purpose: input.purpose,
      notes: input.notes,
    });

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
