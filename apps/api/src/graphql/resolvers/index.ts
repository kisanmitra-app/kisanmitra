import { categoriesResolvers } from "./category";
import { inventoriesResolvers } from "./inventory";
import { productsResolvers } from "./product";
import { profilesResolvers } from "./profile";
import { uploadsResolvers } from "./uploads";
import { usagesResolvers } from "./usage";
import { usersResolvers } from "./users";

/**
 * Array of all GraphQL resolvers.
 */
export const resolvers = [
  usersResolvers,
  profilesResolvers,
  uploadsResolvers,
  categoriesResolvers,
  productsResolvers,
  inventoriesResolvers,
  usagesResolvers,
];
