import { Hono } from "hono";
import { rateLimiter } from "hono-rate-limiter";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { loggingMiddleware } from "./middlewares";
import { routes } from "./routes";
import { getConnInfo } from "@hono/node-server/conninfo";

/**
 * @description Hono app instance
 */
export const app = new Hono();
app.use("*", prettyJSON({ space: 4 }));
app.use(
  "*",
  cors({
    origin: ["*"], // ##TODO: restrict this to your frontend domain
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true, // attach cookies
  })
);

// logger
app.use("*", loggingMiddleware);

// Apply the rate limiting middleware to all requests.
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 200, // Limit each IP to 200 requests per `window` (here, per 15 minutes).
    //  dev
    // windowMs: 5 * 1000, // 5 seconds
    // limit: 5, // Limit each IP to 5 requests per `window` (here, per 6 seconds).
    message: { message: "Too many requests, please try again later." },
    keyGenerator: (c) => {
      const cfIp = c.req.raw.headers.get("CF-Connecting-IP");
      const info = getConnInfo(c); // info is `ConnInfo`
      const key = cfIp || info.remote.address || crypto.randomUUID();
      return key;
    },
  })
);

// register routes
app.route("/", routes);
