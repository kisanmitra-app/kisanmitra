import pino from "pino";

/**
 * Pino logger instance configured for multiple destinations with core service label.
 */
export const logger = pino(
  {
    level: "info",
    // Add custom bindings to append "core" to all logs
    formatters: {
      bindings: (bindings) => {
        return {
          pid: bindings.pid,
          hostname: bindings.hostname,
        };
      },
    },
  },
  pino.transport({
    targets: [
      // Console output with pretty printing
      {
        target: "pino-pretty",
        level: "info",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      },
      // General application logs
      {
        target: "pino/file",
        level: "info",
        options: {
          destination: "./app.log",
          mkdir: true, // Creates directory if it doesn't exist
        },
      },
      // Debug logs (captures all levels including debug)
      {
        target: "pino/file",
        level: "error",
        options: {
          destination: "./error.log",
          mkdir: true,
        },
      },
    ],
  })
);
