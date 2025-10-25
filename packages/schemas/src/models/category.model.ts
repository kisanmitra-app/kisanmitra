import mongoose from "mongoose";
import { ICategory } from "~/interfaces";
import { paginate, toJSON } from "./plugins";
import { IFilter, IQueryOptions, PaginatedDefaultResult } from "~/types";

const categorySchema = new mongoose.Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: false },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Plugins
categorySchema.plugin(toJSON);
categorySchema.plugin(paginate);

type CategoryModel = mongoose.Model<ICategory> & {
  paginate: (
    filter: IFilter,
    options: IQueryOptions
  ) => Promise<PaginatedDefaultResult<ICategory>>;
};

/**
 * Category Model
 * - name: string
 * - description: string
 * - user: ObjectId (reference to User)
 */
export const Category = mongoose.model<ICategory, CategoryModel>(
  "Category",
  categorySchema
);
