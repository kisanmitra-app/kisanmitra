import { Hono } from "hono";
import { v1Routes } from "./v1";

export const routes = new Hono();

routes.get("/", (c) => {
  return c.json({ message: "Welcome to the API" });
});

routes.route("/v1", v1Routes);
