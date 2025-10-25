import { Document, Types } from "mongoose";
import { ICategory } from "./category.interface";
import { IUser } from "./user.interface";

export interface IProduct extends Document {
  name: string;
  category: Types.ObjectId | ICategory;
  brand?: string;
  unit: "kg" | "liter" | "piece" | "bag" | "ml" | "gram";
  description?: string;
  user: Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}
