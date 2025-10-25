import { Document, Types } from "mongoose";
import { IProduct } from "./product.interface";
import { IUser } from "./user.interface";

export interface IInventory extends Document {
  product: Types.ObjectId | IProduct;
  quantity: number;
  batchNumber?: string;
  expiryDate?: Date;
  location?: string;
  notes?: string;
  user: Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}
