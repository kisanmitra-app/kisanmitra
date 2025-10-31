import { Hono } from "hono";
import { graphqlRoutes } from "./graphql.routes";
import { uploadRoutes } from "./upload.routes";

export const apiRoutes = new Hono();

apiRoutes.route("/graphql", graphqlRoutes);
apiRoutes.route("/upload", uploadRoutes);
