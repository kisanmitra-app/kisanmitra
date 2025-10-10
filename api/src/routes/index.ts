import { Hono } from "hono";
import { apiRoutes } from "./api";
import { auth } from "~/lib";

export const routes = new Hono();

routes.get("/", (c) => {
  return c.json({ message: "Welcome to the API" });
});

routes.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

routes.route("/api", apiRoutes);
