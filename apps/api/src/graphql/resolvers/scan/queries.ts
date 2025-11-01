import { IGraphQLContext } from "~/types";
import { Scan } from "@kisan-mitra/schemas";

export const Query = {
  getScans: async (_: any, __: any, context: IGraphQLContext) => {
    const user = context.get("user");

    const scans = await Scan.find({ user: user?.id }).populate([
      "upload",
      "user",
    ]);

    console.log("Fetched scan:", JSON.stringify(scans, null, 2));

    return scans;
  },

  getScanById: async (
    _: any,
    { id }: { id: string },
    context: IGraphQLContext
  ) => {
    const user = context.get("user");

    const scan = await Scan.findOne({ _id: id, user: user?.id }).populate([
      "upload",
      "user",
    ]);

    return scan;
  },
};
