import type { ICreateInventoryInput, IUpdateInventoryInput } from "./types";
import { IInventory, Inventory } from "@kisan-mitra/schemas";
import type { IGraphQLContext } from "~/types";

export const Mutation = {
  createInventory: async (
    _: any,
    { input }: { input: ICreateInventoryInput },
    context: IGraphQLContext
  ): Promise<IInventory> => {
    const user = context.get("user");
    const doc = await Inventory.create({ ...input, user: user?.id });
    await doc.populate([
      "user",
      {
        path: "product",
        populate: [
          { path: "user" },
          { path: "category", populate: { path: "user" } },
        ],
      },
    ]);
    return doc;
  },

  updateInventory: async (
    _: any,
    { id, input }: { id: string; input: IUpdateInventoryInput }
  ): Promise<IInventory | null> => {
    const doc = await Inventory.findById(id);
    if (!doc) throw new Error("Inventory not found");
    doc.set({ ...input });
    await doc.save();
    await doc.populate([
      "user",
      {
        path: "product",
        populate: [
          { path: "user" },
          { path: "category", populate: { path: "user" } },
        ],
      },
    ]);
    return doc;
  },

  deleteInventory: async (_: any, { id }: { id: string }): Promise<boolean> => {
    const res = await Inventory.findByIdAndDelete(id);
    return !!res;
  },
};
