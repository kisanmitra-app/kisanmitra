import { inventorySummaryWorker } from "./inventory-summary.worker";
import { weatherUpdateWorker } from "./weather-update.worker";

export const shutdownAllWorkers = async () => {
  await Promise.all([
    weatherUpdateWorker.close(),
    inventorySummaryWorker.close(),
  ]);
};
