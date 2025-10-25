import { Document, Types } from "mongoose";
import { IUser } from "./user.interface";

export interface ICategory extends Document {
  name: string;
  description?: string;
  user: IUser | Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
