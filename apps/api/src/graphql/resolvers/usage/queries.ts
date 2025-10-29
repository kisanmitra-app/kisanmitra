import { Usage } from "@kisan-mitra/schemas";
import { IGraphQLContext } from "~/types";

export const Query = {
  getUsages: async (_: any, __: any, context: IGraphQLContext) => {
    const user = context.get("user");

    const usages = await Usage.find({
      user: user?.id,
    }).populate([
      "user",
      "inventory",
      {
        path: "inventory",
        populate: {
          path: "product",
          populate: [
            { path: "user" },
            { path: "category", populate: { path: "user" } },
          ],
        },
      },
    ]);
    return usages;
  },

  getInventoryUsages: async (
    _: any,
    { inventoryId }: { inventoryId?: string },
    context: IGraphQLContext
  ) => {
    const user = context.get("user");

    const usages = await Usage.find({
      user: user?.id,
      inventory: inventoryId,
    }).populate([
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

    return usages;
  },
};
