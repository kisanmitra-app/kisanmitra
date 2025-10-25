import { IInventory, Inventory } from "@kisan-mitra/schemas";
import { IGraphQLContext } from "~/types";

export const Query = {
  inventories: async (
    _: any,
    __: any,
    context: IGraphQLContext
  ): Promise<IInventory[]> => {
    const user = context.get("user");
    const docs = await Inventory.find({ user: user?.id }).populate([
      "user",
      "product",
    ]);
    return docs;
  },

  inventoryById: async (
    _: any,
    { id }: { id: string }
  ): Promise<IInventory | null> => {
    return Inventory.findById(id).populate(["user", "product"]);
  },
};
