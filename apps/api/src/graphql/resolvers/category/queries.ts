import { ICategory, Category } from "@kisan-mitra/schemas";
import { IGraphQLContext } from "~/types";

export const Query = {
  categories: async (
    _: any,
    __: any,
    context: IGraphQLContext
  ): Promise<ICategory[]> => {
    const user = context.get("user");
    // return categories for the current user
    const docs = await Category.find({ user: user?.id }).populate(["user"]);
    return docs;
  },

  categoryById: async (
    _: any,
    { id }: { id: string }
  ): Promise<ICategory | null> => {
    return Category.findById(id).populate(["user"]);
  },
};
