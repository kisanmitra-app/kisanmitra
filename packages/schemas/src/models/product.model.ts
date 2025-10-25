import mongoose from "mongoose";
import { IProduct } from "~/interfaces";
import { paginate, toJSON } from "./plugins";
import { IFilter, IQueryOptions, PaginatedDefaultResult } from "~/types";

const productSchema = new mongoose.Schema<IProduct>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: false },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: { type: String, required: false },
    unit: {
      type: String,
      required: true,
      enum: ["kg", "liter", "piece", "bag", "ml", "gram"],
    },
  },
  {
    timestamps: true,
  }
);

// Plugins
productSchema.plugin(toJSON);
productSchema.plugin(paginate);

type ProductModel = mongoose.Model<IProduct> & {
  paginate: (
    filter: IFilter,
    options: IQueryOptions
  ) => Promise<PaginatedDefaultResult<IProduct>>;
};

/**
 * Product Model
 * - name: string
 * - description: string
 * - user: ObjectId (reference to User)
 * - category: ObjectId (reference to Category)
 * - brand: string
 * - unit: string (enum: "kg", "liter", "piece", "bag", "ml", "gram")
 */
export const Product = mongoose.model<IProduct, ProductModel>(
  "Product",
  productSchema
);
