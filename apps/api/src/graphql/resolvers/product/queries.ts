import { IProduct, Product } from "@kisan-mitra/schemas";
import { IGraphQLContext } from "~/types";

export const Query = {
  products: async (
    _: any,
    __: any,
    context: IGraphQLContext
  ): Promise<IProduct[]> => {
    const user = context.get("user");
    const docs = await Product.find({ user: user?.id }).populate([
      "user",
      "category",
    ]);
    return docs;
  },

  productById: async (
    _: any,
    { id }: { id: string }
  ): Promise<IProduct | null> => {
    return Product.findById(id).populate(["user", "category"]);
  },
};
