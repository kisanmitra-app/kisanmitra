import * as mongoose from "mongoose";
import type { IScan } from "../interfaces";
import { paginate, toJSON } from "./plugins";
import { IFilter, IQueryOptions, PaginatedDefaultResult } from "~/types";

const scanSchema = new mongoose.Schema<IScan>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    upload: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Upload",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    scannedAt: { type: Date },

    affected: { type: Boolean, default: false },
    resolved: { type: Boolean, default: false },
    resolvedAt: { type: Date },

    notifyNearbyFarmers: { type: Boolean, default: false },
    notificationRadiusKm: { type: Number, default: 5 },

    results: [
      {
        defectType: { type: String, required: true },
        severity: { type: String, required: true },
        confidence: { type: Number, required: true },
      },
    ],
    aiInsights: {
      summary: { type: String },
      recommendations: [{ type: String }],
    },
  },
  {
    timestamps: true,
  }
);

// Plugins
scanSchema.plugin(toJSON);
scanSchema.plugin(paginate);

type ScanModel = mongoose.Model<IScan> & {
  paginate: (
    filter: IFilter,
    options: IQueryOptions
  ) => Promise<PaginatedDefaultResult<IScan>>;
};

/**
 * Scan Model - represents a scan performed by a user.
 * - user: reference to the user who performed the scan
 * - upload: reference to the uploaded file that was scanned
 * - scannedAt: timestamp when the scan was performed
 * - status: current status of the scan (pending, processing, completed, failed)
 * - affected: boolean indicating if any defects were found
 * - resolved: boolean indicating if the detected issues have been resolved
 * - notifyNearbyFarmers: whether to notify nearby farmers about detected issues
 * - notificationRadiusKm: radius in kilometers for notifications
 * - results: array of detected defects with type, severity, and confidence
 * - aiInsights: AI-generated insights including summary and recommendations
 * - createdAt: timestamp when the scan record was created
 * - updatedAt: timestamp when the scan record was last updated
 *
 */
export const Scan = mongoose.model<IScan, ScanModel>("Scan", scanSchema);
