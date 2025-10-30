import { Hono } from "hono";
import { authMiddleware } from "~/middlewares";
import { UploadService } from "~/services";
import { HonoContext } from "~/types";

export const uploadRoutes = new Hono<HonoContext>();

uploadRoutes.use("/*", authMiddleware);

const uploadService = new UploadService();

uploadRoutes.post("/", async (c) => {
  const body = await c.req.parseBody();
  const file = body["file"];
  const user = c.get("user");

  if (typeof file === "string") {
    return c.json({ error: "File is required" }, 400);
  }

  const upload = await uploadService.uploadFile(user?.id!, file);
  return c.json({ upload });
});
