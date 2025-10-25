import { Document, Types } from "mongoose";
import { IUser } from "./user.interface";

export interface IUpload extends Document {
  filename: string;
  mimetype: string;
  size: number;
  url: string;
  s3Key: string;
  duration?: number; // in seconds, for audio/video files
  width?: number; // for image/video files
  height?: number; // for image/video files
  deletedAt?: Date;
  uploadedBy: Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}
