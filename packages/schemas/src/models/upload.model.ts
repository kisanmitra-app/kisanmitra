import * as mongoose from "mongoose";
import type { IUpload } from "../interfaces";
import { toJSON } from "./plugins";

const uploadSchema = new mongoose.Schema<IUpload>(
  {
    filename: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String },
    s3Key: { type: String },
    duration: { type: Number },
    width: { type: Number },
    height: { type: Number },
    deletedAt: { type: Date },
    uploadedBy: {
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
uploadSchema.plugin(toJSON);

/**
 * Upload Model - represents an uploaded file.
 * - fileName: the name of the uploaded file
 * - mimeType: the MIME type of the file
 * - size: size of the file in bytes
 * - url: accessible URL of the uploaded file
 * - s3Key: S3 storage key for the file
 * - duration: (optional) duration in seconds for audio/video files
 * - width: (optional) width for image/video files
 * - height: (optional) height for image/video files
 * - deletedAt: (optional) timestamp when the file was deleted
 * - uploadedBy: reference to the user who uploaded the file
 * - createdAt: timestamp when the file record was created
 * - updatedAt: timestamp when the file record was last updated
 */
export const Upload = mongoose.model<IUpload>("Upload", uploadSchema);
