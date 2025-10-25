import { serve } from "@hono/node-server";
import { app } from "./app";
import { env } from "./config";
import { logger } from "./lib";
import { connectToDatabase } from "./lib/mongo";

const main = async () => {
  await connectToDatabase();
  serve({ fetch: app.fetch, port: env.HTTP_PORT, serverOptions: {} }, (info) =>
    logger.info(
      `${env.APP_NAME} is running on http://${env.HTTP_HOST}:${env.HTTP_PORT}`
    )
  );
};

const handleGracefulShutdown = () => {
  logger.info("Shutting down gracefully...");
  process.exit(0);
};

process.on("SIGINT", handleGracefulShutdown);
process.on("SIGTERM", handleGracefulShutdown);

main().catch((error) => {
  logger.error("Error starting the server:", error);
  process.exit(1);
});
