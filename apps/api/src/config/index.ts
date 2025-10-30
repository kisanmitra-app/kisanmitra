import * as envalid from "envalid";
import * as dotenv from "dotenv";
export * from "./CONSTS";

dotenv.config({ path: [".env"] });

/**
 * @description environment variables
 */
export const env = envalid.cleanEnv(process.env, {
  // ========= APP =========
  APP_NAME: envalid.str({ default: "kisan-mitra" }),
  APP_VERSION: envalid.str({ default: "0.1.0" }),
  APP_DEBUG: envalid.bool({ default: true }),
  APP_ENV: envalid.str({
    choices: ["development", "production", "test"],
    default: "development",
  }),

  // ========= HTTP =========
  HTTP_PORT: envalid.port({ default: 8080 }),
  HTTP_HOST: envalid.str({ default: "127.0.0.1" }),

  // ========= DATABASE =========
  MONGO_URI: envalid.str(),

  // ========= REDIS =========
  REDIS_URI: envalid.str(),

  // ========= GOOGLE AUTH =========
  GOOGLE_CLIENT_ID: envalid.str(),
  GOOGLE_CLIENT_SECRET: envalid.str(),
  GOOGLE_REDIRECT_URI: envalid.str({ default: "KisanMitra://callback" }),

  // ========= SMTP =========
  SMTP_HOST: envalid.str(),
  SMTP_PORT: envalid.port(),
  SMTP_USER: envalid.str(),
  SMTP_PASS: envalid.str(),
  SMTP_FROM: envalid.str(),
  SMTP_SECURE: envalid.bool({ default: false }),

  // ========= S3 =========
  S3_ACCESS_KEY_ID: envalid.str(),
  S3_SECRET_ACCESS_KEY: envalid.str(),
  S3_REGION: envalid.str(),
  S3_ENDPOINT: envalid.str(),
  S3_BUCKET_NAME: envalid.str(),
});
