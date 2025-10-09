import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { routes } from "./routes";
import { loggingMiddleware } from "./middlewares";

/**
 * @description Hono app instance
 */
export const app = new Hono();
app.use("*", prettyJSON({ space: 4 }));
app.use(
  "*",
  cors({
    origin: ["*"],
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

// logger
app.use("*", loggingMiddleware);

// register routes
app.route("/", routes);
