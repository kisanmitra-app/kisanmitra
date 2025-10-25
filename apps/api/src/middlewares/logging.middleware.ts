import { createMiddleware } from "hono/factory";
import { logger } from "~/lib";

export const loggingMiddleware = createMiddleware(async (c, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  logger.info(`${c.req.method} ${c.req.url} - ${ms}ms`);
});
