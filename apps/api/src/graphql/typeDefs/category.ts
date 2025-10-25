import { gql } from "graphql-tag";

export const categoriesTypeDefs = gql`
  type Category {
    id: ID!
    name: String!
    description: String
    user: User!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    categories: [Category!]
    categoryById(id: ID!): Category
  }

  input CreateCategoryInput {
    name: String!
    description: String
  }

  input UpdateCategoryInput {
    name: String
    description: String
  }

  type Mutation {
    createCategory(input: CreateCategoryInput!): Category
    updateCategory(id: ID!, input: UpdateCategoryInput!): Category
    deleteCategory(id: ID!): Boolean
  }
`;
