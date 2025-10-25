import { Hono } from "hono";
import { auth } from "~/lib/auth";
import { name, version } from "../../package.json";
import { apiRoutes } from "./api";

export const routes = new Hono();

routes.get("/", (c) => {
  return c.json({ name, version });
});

routes.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

routes.route("/api", apiRoutes);
