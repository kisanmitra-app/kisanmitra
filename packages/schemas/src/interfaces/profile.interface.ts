import { Document, Types } from "mongoose";
import { IUser } from "./user.interface";

export interface IProfile extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId | IUser;

  // basic Info
  name?: string;
  location: {
    type: string; // e.g., "Point", "Polygon", etc.
    coordinates: [number, number]; // [longitude, latitude]
  };
  address: {
    city?: string;
    region?: string;
    country?: string;
  };

  // explore tab
  aiInventorySummary: {
    recommendations: string[];
    seasonalForecasts: {
      period: string;
      expectedDemand: string;
      suggestedActions: string[];
    }[];
    cropCycleInsights: {
      crop: string;
      cycle: string;
      inventoryNeeds: string[];
    }[];
    procurementPlan: {
      item: string;
      currentQuantity: string;
      recommendedQuantity: string;
      timing: string;
      rationale: string;
    }[];
    yieldImprovementTips: string[];
  };

  createdAt: Date;
  updatedAt: Date;
}
