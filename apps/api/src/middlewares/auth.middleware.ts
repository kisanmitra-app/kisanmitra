import { createMiddleware } from "hono/factory";
import { auth } from "~/lib/auth";

/**
 * Authentication middleware to verify auth tokens
 * It checks the Authorization header for a Bearer token, verifies it,
 * and attaches the user information to the context if valid.
 */
export const authMiddleware = createMiddleware(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  // Attach user and session to context
  c.set("user", session?.user || null);
  c.set("session", session?.session || null);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await next();
});
