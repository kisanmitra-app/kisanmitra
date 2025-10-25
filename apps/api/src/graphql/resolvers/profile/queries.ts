import { IProfile, Profile } from "@kisan-mitra/schemas";
import { IGraphQLContext } from "~/types";

export const Query = {
  /**
   * get the profile in current context / get profile of the queried user
   */
  profile: async (
    _: any,
    { id }: { id?: string },
    context: IGraphQLContext
  ): Promise<IProfile | null> => {
    const user = context.get("user");

    if (id) {
      const profileByIdDoc = await Profile.findOne({ user: id }).populate([
        "user",
      ]);

      return profileByIdDoc;
    }

    const profileDoc = await Profile.findOne({ user: user?.id }).populate([
      "user",
    ]);
    return profileDoc;
  },
};
