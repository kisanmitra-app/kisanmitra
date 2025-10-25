import { IUser, User } from "@kisan-mitra/schemas";
import { IGraphQLContext } from "~/types";

export const Query = {
  /**
   * get user by id
   */
  userById: async (_: any, { id }: { id: string }): Promise<IUser | null> => {
    return User.findById(id);
  },

  /**
   * get the user in current context
   */
  user: async (
    _: any,
    __: any,
    context: IGraphQLContext
  ): Promise<IUser | null> => {
    const user = context.get("user");
    const userDoc = await User.findById(user?.id);
    return userDoc;
  },
};
