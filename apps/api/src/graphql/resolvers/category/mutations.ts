import type { ICreateCategoryInput, IUpdateCategoryInput } from "./types";
import { ICategory, Category } from "@kisan-mitra/schemas";
import type { IGraphQLContext } from "~/types";

export const Mutation = {
  createCategory: async (
    _: any,
    { input }: { input: ICreateCategoryInput },
    context: IGraphQLContext
  ): Promise<ICategory> => {
    const user = context.get("user");
    const category = await Category.create({ ...input, user: user?.id });
    await category.populate(["user"]);
    return category;
  },

  updateCategory: async (
    _: any,
    { id, input }: { id: string; input: IUpdateCategoryInput }
  ): Promise<ICategory | null> => {
    const category = await Category.findById(id);
    if (!category) throw new Error("Category not found");
    category.set({ ...input });
    await category.save();
    await category.populate(["user"]);
    return category;
  },

  deleteCategory: async (_: any, { id }: { id: string }): Promise<boolean> => {
    const res = await Category.findByIdAndDelete(id);
    return !!res;
  },
};
