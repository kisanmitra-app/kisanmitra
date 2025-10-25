import mongoose from "mongoose";
import { IUsage } from "~/interfaces";
import { paginate, toJSON } from "./plugins";
import { IFilter, IQueryOptions, PaginatedDefaultResult } from "~/types";

const usageSchema = new mongoose.Schema<IUsage>(
  {
    inventory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
      required: true,
    },
    quantityUsed: { type: Number, required: true },
    usedOn: { type: Date, required: true },
    crop: { type: String },
    field: { type: String },
    purpose: { type: String },
    notes: { type: String },
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
usageSchema.plugin(toJSON);
usageSchema.plugin(paginate);

type UsageModel = mongoose.Model<IUsage> & {
  paginate: (
    filter: IFilter,
    options: IQueryOptions
  ) => Promise<PaginatedDefaultResult<IUsage>>;
};

/**
 * Usage Model
 * - inventory: ObjectId (reference to Inventory)
 * - quantityUsed: number
 * - usedOn: Date
 * - crop?: string
 * - field?: string
 * - purpose?: string
 * - notes?: string
 * - user: ObjectId (reference to User)
 */
export const Usage = mongoose.model<IUsage, UsageModel>("Usage", usageSchema);
