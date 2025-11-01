import { Document, Types } from "mongoose";
import { IUser } from "./user.interface";
import { IUpload } from "./upload.interface";

export interface IScan extends Document {
  user: IUser | Types.ObjectId;
  upload: IUpload | Types.ObjectId;

  status: "pending" | "processing" | "completed" | "failed";
  scannedAt: Date;

  affected: boolean;
  resolved: boolean;
  resolvedAt: Date;

  notifyNearbyFarmers: boolean;
  notificationRadiusKm: number;

  results: {
    defectType: string;
    severity: string;
    confidence: number;
  }[];

  aiInsights: {
    summary: string;
    recommendations: string[];
  };

  createdAt: Date;
  updatedAt: Date;
}
