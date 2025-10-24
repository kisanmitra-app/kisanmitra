import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { db } from "./mongo";
import { env } from "~/config";

/**
 * Authentication Instance
 */
export const auth = betterAuth({
  plugins: [expo()],
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      prompt: "consent",
      redirectURI: env.GOOGLE_REDIRECT_URI,
    },
  },
  database: mongodbAdapter(db),
  emailAndPassword: { enabled: true },
  trustedOrigins: [
    "exp://172.20.10.3:8081/--/callback",
    "exp://192.168.1.6:8081/--/callback",
    "exp://192.168.1.6:8081/--/(app)/(tabs)",
  ],
});
