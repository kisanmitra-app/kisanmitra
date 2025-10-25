import { Types } from "mongoose";
import { IInventory } from "./inventory.interface";
import { IUser } from "./user.interface";

export interface IUsage extends Document {
  inventory: Types.ObjectId | IInventory;
  quantityUsed: number;
  usedOn: Date;
  crop?: string;
  field?: string;
  purpose?: string;
  notes?: string;
  user: Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}
