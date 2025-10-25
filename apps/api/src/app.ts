import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { loggingMiddleware } from "./middlewares";
import { routes } from "./routes";

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

// register routes
app.route("/", routes);
