import { gql } from "graphql-tag";

export const inventoriesTypeDefs = gql`
  type Inventory {
    id: ID!
    product: Product!
    quantity: Float!
    batchNumber: String
    expiryDate: String
    location: String
    notes: String
    user: User!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    inventories: [Inventory!]
    inventoryById(id: ID!): Inventory
  }

  input CreateInventoryInput {
    product: String!
    quantity: Float!
    batchNumber: String
    expiryDate: String
    location: String
    notes: String
  }

  input UpdateInventoryInput {
    quantity: Float
    batchNumber: String
    expiryDate: String
    location: String
    notes: String
  }

  type Mutation {
    createInventory(input: CreateInventoryInput!): Inventory
    updateInventory(id: ID!, input: UpdateInventoryInput!): Inventory
    deleteInventory(id: ID!): Boolean
  }
`;
