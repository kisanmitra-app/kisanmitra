import * as mongoose from "mongoose";
import { PaginatedDefaultResult } from "~/types";
import { IUser } from "../interfaces";
import { paginate, toJSON } from "./plugins";

/**
 * userSchema - Schema for the User model
 * - email: User's email address
 * - name: Full name of the user
 * - image: URL to the user's profile picture
 */
const userSchema = new mongoose.Schema<IUser>(
  {
    email: { type: String, sparse: true, lowercase: true },
    name: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

// Create a 2dsphere index on the location field for geospatial queries
userSchema.index({ location: "2dsphere" });

// Plugins
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

type UserModel = mongoose.Model<IUser> & {
  paginate: (
    filter: any,
    options: any
  ) => Promise<PaginatedDefaultResult<IUser>>;
};

/**
 * User - Mongoose model for the User schema
 */
export const User = mongoose.model<IUser, UserModel>("User", userSchema);
