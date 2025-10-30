import { connectToMongo } from "./lib";
import {
  weatherUpdateQueueHelpers,
  inventorySummaryQueueHelpers,
} from "./queues";
import { shutdownAllWorkers } from "./workers";

const main = async () => {
  await connectToMongo();

  const userId = "68fcff12ccc103e78470f295";
  // await weatherUpdateQueueHelpers.removeRepeatableJob(
  //   `weather-update-${userId}:*/30 * * * * *`
  // );

  await inventorySummaryQueueHelpers.addJob(userId).then(() => {
    console.log("done");
  });
};

main();

const handleGracefulShutdown = async () => {
  await shutdownAllWorkers();
  process.exit(0);
};

process.on("SIGINT", handleGracefulShutdown);
process.on("SIGTERM", handleGracefulShutdown);
