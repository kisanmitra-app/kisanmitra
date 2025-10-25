import { Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  image: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
