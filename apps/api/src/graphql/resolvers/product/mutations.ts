import type { ICreateProductInput, IUpdateProductInput } from "./types";
import { IProduct, Product } from "@kisan-mitra/schemas";
import type { IGraphQLContext } from "~/types";

export const Mutation = {
  createProduct: async (
    _: any,
    { input }: { input: ICreateProductInput },
    context: IGraphQLContext
  ): Promise<IProduct> => {
    const user = context.get("user");
    const product = await Product.create({ ...input, user: user?.id });
    await product.populate([
      "user",
      "category",
      { path: "category", populate: { path: "user" } },
    ]);
    return product;
  },

  updateProduct: async (
    _: any,
    { id, input }: { id: string; input: IUpdateProductInput }
  ): Promise<IProduct | null> => {
    const product = await Product.findById(id);
    if (!product) throw new Error("Product not found");
    product.set({ ...input });
    await product.save();
    await product.populate([
      "user",
      "category",
      { path: "category", populate: { path: "user" } },
    ]);
    return product;
  },

  deleteProduct: async (_: any, { id }: { id: string }): Promise<boolean> => {
    const res = await Product.findByIdAndDelete(id);
    return !!res;
  },
};
