import { graphqlServer } from "@hono/graphql-server";
import { Hono } from "hono";
import { env } from "~/config";
import { schema } from "~/graphql";
import { printSchema } from "graphql";
import { logger } from "~/lib";
import { authMiddleware } from "~/middlewares";

export const graphqlRoutes = new Hono();

graphqlRoutes.get("/schema", (c) => {
  const schemaSDL = printSchema(schema);
  return c.text(schemaSDL);
});

graphqlRoutes.use("*", authMiddleware); // Apply authentication middleware to all GraphQL routes

graphqlRoutes.use(
  "/",
  graphqlServer({
    schema: schema,
    rootResolver: (c) => {
      return {
        user: c.get("user") || null, // Pass the user from context to resolvers
      };
    }, // Use the context as the root resolver
    graphiql: env.APP_ENV === "development", // Enable GraphiQL in development mode
  })
);

logger.info("GraphiQL endpoint is set up at http://localhost:8000/api/graphql");
