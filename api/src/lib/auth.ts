import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { db } from "./mongo";

/**
 * Authentication Instance
 */
export const auth = betterAuth({
  plugins: [expo()],
  database: mongodbAdapter(db),
  emailAndPassword: { enabled: true },
  trustedOrigins: ["KisanMitra://"],
});
