import { profilesResolvers } from "./profile";
import { uploadsResolvers } from "./uploads";
import { usersResolvers } from "./users";
import { categoriesResolvers } from "./category";
import { productsResolvers } from "./product";
import { inventoriesResolvers } from "./inventory";

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
];
