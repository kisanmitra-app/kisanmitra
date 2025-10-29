import gql from "graphql-tag";

export const usagesTypeDefs = gql`
  type Usage {
    id: ID!
    inventory: Inventory!
    quantityUsed: Float!
    usedOn: String!
    crop: String
    field: String
    purpose: String
    notes: String
    user: User!
    createdAt: String!
    updatedAt: String!
  }

  input CreateUsageInput {
    inventoryId: ID!
    quantityUsed: Float!
    usedOn: String!
    crop: String
    field: String
    purpose: String
    notes: String
  }

  type Query {
    getUsages: [Usage!]!
    getInventoryUsages(inventoryId: ID): [Usage!]!
  }

  type Mutation {
    createUsage(input: CreateUsageInput!): Usage!
  }
`;
