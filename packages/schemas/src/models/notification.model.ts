import * as mongoose from "mongoose";
import type { INotification } from "../interfaces";
import { paginate, toJSON } from "./plugins";
import { PaginatedDefaultResult } from "~/types";

const notificationSchema = new mongoose.Schema<INotification>(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["system"],
    },
    relatedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date },
    isSeen: { type: Boolean, default: false },
    seenAt: { type: Date },
  },
  { timestamps: true }
);

// Index for efficient notification retrieval
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

//Plugins
notificationSchema.plugin(toJSON);
notificationSchema.plugin(paginate);

type NotificationModel = mongoose.Model<INotification> & {
  paginate: (
    filter: any,
    options: any
  ) => Promise<PaginatedDefaultResult<INotification>>;
};

/**
 * Notification - Represents a notification sent to a user.
 * - recipient: The user receiving the notification.
 * - type: The type of notification (e.g., 'system').
 * - relatedUser: The user related to the notification (e.g., the user who liked).
 * - message: The content of the notification.
 * - isRead: Whether the notification has been read.
 * - readAt: Timestamp when the notification was read.
 * - isSeen: Whether the notification has been seen.
 * - seenAt: Timestamp when the notification was seen.
 */
export const Notification = mongoose.model<INotification, NotificationModel>(
  "Notification",
  notificationSchema
);
