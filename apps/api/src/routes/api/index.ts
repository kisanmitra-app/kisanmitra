import { Hono } from "hono";
import { graphqlRoutes } from "./graphql.routes";

export const apiRoutes = new Hono();

apiRoutes.route("/graphql", graphqlRoutes);
