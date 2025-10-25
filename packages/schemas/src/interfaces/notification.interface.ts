import { Types } from "mongoose";
import { IUser } from "./user.interface";

export interface INotification extends Document {
  recipient: Types.ObjectId | IUser;
  type: "system";
  relatedUser: Types.ObjectId | IUser; // User who triggered the notification
  message: string;
  isRead: boolean;
  readAt: Date; // when user opens the notification
  isSeen: boolean;
  seenAt: Date; // when notification appears in the app
  createdAt: Date;
  updatedAt: Date;
}
