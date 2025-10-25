import type { IUpdateProfileInput } from "./types";
import { IProfile, Profile } from "@kisan-mitra/schemas";
import type { IGraphQLContext } from "~/types";

export const Mutation = {
  updateProfile: async (
    _: any,
    { input }: { input: IUpdateProfileInput },
    context: IGraphQLContext
  ): Promise<IProfile> => {
    const user = context.get("user");
    const profile = await Profile.findOne({ user: user?.id });
    if (!profile) {
      throw new Error("Profile not found");
    }

    const updatedProfile = deepMerge(profile.toObject(), input);
    profile.set(updatedProfile);

    await profile.save();
    await profile.populate(["user", "photos"]);

    return profile;
  },
};

const deepMerge = (target: any, source: any) => {
  for (const key of Object.keys(source)) {
    if (
      source[key] instanceof Object &&
      key in target &&
      target[key] instanceof Object
    ) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  }

  // Join `target` and modified `source`
  return { ...target, ...source };
};
