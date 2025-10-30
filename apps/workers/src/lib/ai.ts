import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { env } from "~/config";

export const google = createGoogleGenerativeAI({
  apiKey: env.GOOGLE_API_KEY,
});
