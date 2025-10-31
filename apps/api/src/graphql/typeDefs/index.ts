import { categoriesTypeDefs } from "./category";
import { inventoriesTypeDefs } from "./inventory";
import { productsTypeDefs } from "./product";
import { profilesTypeDefs } from "./profile";
import { scansTypeDefs } from "./scan";
import { uploadsTypeDefs } from "./upload";
import { usagesTypeDefs } from "./usage";
import { usersTypeDefs } from "./users";
import { weatherTypeDefs } from "./weather";

export const typeDefs = [
  usersTypeDefs,
  profilesTypeDefs,
  uploadsTypeDefs,
  categoriesTypeDefs,
  productsTypeDefs,
  usagesTypeDefs,
  inventoriesTypeDefs,
  weatherTypeDefs,
  scansTypeDefs,
];
