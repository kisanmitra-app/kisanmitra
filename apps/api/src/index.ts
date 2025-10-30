import { serve } from "@hono/node-server";
import { env } from "~/config";
import { app } from "./app";
import { connectToMongo, logger } from "./lib";
import { seedDatabase } from "./seed";

const main = async () => {
  await connectToMongo();
  // await seedDatabase();
  serve({ fetch: app.fetch, port: env.HTTP_PORT }, () =>
    logger.info(
      `${env.APP_NAME} is running on ${env.HTTP_HOST}:${env.HTTP_PORT}`
    )
  );
};

main();

const handleGracefulShutdown = async () => {
  process.exit(0);
};

process.on("SIGINT", handleGracefulShutdown);
process.on("SIGTERM", handleGracefulShutdown);
