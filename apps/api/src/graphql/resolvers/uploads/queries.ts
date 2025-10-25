import { Upload } from "@kisan-mitra/schemas";
import { IGraphQLContext } from "~/types";

export const Query = {
  uploadById: async (
    _: any,
    { id }: { id: string },
    context: IGraphQLContext
  ) => {
    const upload = await Upload.findById(id);
    return upload;
  },
};
