import mongoose from "mongoose";
import { IInventory } from "~/interfaces";
import { paginate, toJSON } from "./plugins";
import { IFilter, IQueryOptions, PaginatedDefaultResult } from "~/types";

const inventorySchema = new mongoose.Schema<IInventory>(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true, default: 0 },
    batchNumber: { type: String },
    expiryDate: { type: Date },
    location: { type: String },
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
inventorySchema.plugin(toJSON);
inventorySchema.plugin(paginate);

type InventoryModel = mongoose.Model<IInventory> & {
  paginate: (
    filter: IFilter,
    options: IQueryOptions
  ) => Promise<PaginatedDefaultResult<IInventory>>;
};

/**
 * Inventory Model
 * - product: ObjectId (reference to Product)
 * - quantity: number
 * - batchNumber?: string
 * - expiryDate?: Date
 * - location?: string
 * - notes?: string
 * - user: ObjectId (reference to User)
 */
export const Inventory = mongoose.model<IInventory, InventoryModel>(
  "Inventory",
  inventorySchema
);
