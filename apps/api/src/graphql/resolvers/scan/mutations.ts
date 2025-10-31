import { Scan } from "@kisan-mitra/schemas";
import { IGraphQLContext } from "~/types";

export const Mutation = {
  createScan: async (
    _: any,
    { uploadId }: { uploadId: string },
    context: IGraphQLContext
  ) => {
    const user = context.get("user");

    const scan = await Scan.create({
      user: user?.id,
      upload: uploadId,
      scannedAt: new Date(),
    });

    await scan.populate(["user", "upload"]);

    console.log("Created scan:", JSON.stringify(scan, null, 2));

    return scan;
  },
};
