import { weatherUpdateWorker } from "./weather-update.worker";

export const shutdownAllWorkers = async () => {
  await Promise.all([weatherUpdateWorker.close()]);
};
