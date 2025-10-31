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
    scannedAt: { type: Date, required: true, default: Date.now },
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
 * - results: array of detected defects with type, severity, and confidence
 * - aiInsights: AI-generated insights including summary and recommendations
 * - createdAt: timestamp when the scan record was created
 * - updatedAt: timestamp when the scan record was last updated
 */
export const Scan = mongoose.model<IScan, ScanModel>("Scan", scanSchema);
