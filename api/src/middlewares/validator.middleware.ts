import { Context } from "hono";
import * as z from "zod";

/**
 *
 * @param schema zod schema to validate against
 * @returns
 */
export const validateWebhook = <T>(schema: z.ZodSchema<T>) => {
  return async (c: Context, next: () => Promise<void>) => {
    try {
      const rawPayload = await c.req.json();
      const payload = schema.parse(rawPayload);
      c.set("webhookPayload", payload);
      await next();
    } catch (error) {
      return c.json({ error: "Invalid webhook payload" }, 400);
    }
  };
};
