import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { emailOTP } from "better-auth/plugins/email-otp";
import { db } from "./mongo";
import { env } from "~/config";
import { logger } from "./logger";
import { Profile } from "@kisan-mitra/schemas";

/**
 * Authentication Instance
 */
export const auth = betterAuth({
  plugins: [
    expo(),
    emailOTP({
      sendVerificationOTP: async ({ email, otp, type }) => {
        if (type === "sign-in") {
          if (env.APP_ENV === "development") {
            logger.info(`Login OTP for ${email}: ${otp}`);
            return;
          }
          // const html = await render(LoginOtpEmail({ validationCode: otp }));
          // await transporter.sendMail({
          //   to: email,
          //   from: env.SMTP_FROM,
          //   subject: "Your Login OTP Code",
          //   html,
          // });
        }
      },
    }),
  ],
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      prompt: "consent",
      redirectURI: env.GOOGLE_REDIRECT_URI,
    },
  },
  database: mongodbAdapter(db, { debugLogs: false, usePlural: true }),
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await Profile.create({
            user: user.id,
            name: user.name ? user.name : user.email?.split("@")[0],
          });
        },
      },
    },
  },
  emailAndPassword: { enabled: true },

  trustedOrigins: [
    "exp://172.20.10.3:8081/--/callback",
    "exp://192.168.1.6:8081/--/callback",
    "exp://192.168.1.6:8081/--/(app)/(tabs)",
  ],
});
