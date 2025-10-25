import { profilesResolvers } from "./profile";
import { uploadsResolvers } from "./uploads";
import { usersResolvers } from "./users";

/**
 * Array of all GraphQL resolvers.
 */
export const resolvers = [usersResolvers, profilesResolvers, uploadsResolvers];
