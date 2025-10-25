import * as mongoose from "mongoose";
import { IFilter, IQueryOptions, PaginatedDefaultResult } from "~/types";
import { IProfile } from "../interfaces";
import { paginate, toJSON } from "./plugins";

const profileSchema = new mongoose.Schema<IProfile>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    address: {
      city: { type: String },
      region: { type: String },
      country: { type: String },
    },
    name: { type: String },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        default: [0, 0],
      },
    },
  },
  { timestamps: true }
);

// Create a 2dsphere index on the location field for geospatial queries
profileSchema.index({ location: "2dsphere" });

// Plugins
profileSchema.plugin(toJSON);
profileSchema.plugin(paginate);

type ProfileModel = mongoose.Model<IProfile> & {
  paginate: (
    filter: IFilter,
    options: IQueryOptions
  ) => Promise<PaginatedDefaultResult<IProfile>>;
};

/**
 * Profile - Mongoose model for the Profile schema
 * - address: User's address details
 * - name: User's full name
 * - user: Reference to the User model
 * - location: GeoJSON Point representing user's location
 */
export const Profile = mongoose.model<IProfile, ProfileModel>(
  "Profile",
  profileSchema
);
