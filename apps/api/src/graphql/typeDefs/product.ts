import { gql } from "graphql-tag";

export const productsTypeDefs = gql`
  type Product {
    id: ID!
    name: String!
    description: String
    user: User!
    category: Category!
    brand: String
    unit: String
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    products: [Product!]
    productById(id: ID!): Product
  }

  input CreateProductInput {
    name: String!
    description: String
    categoryId: ID!
    brand: String
    unit: String
  }

  input UpdateProductInput {
    name: String
    description: String
    categoryId: ID
    brand: String
    unit: String
  }

  type Mutation {
    createProduct(input: CreateProductInput!): Product
    updateProduct(id: ID!, input: UpdateProductInput!): Product
    deleteProduct(id: ID!): Boolean
  }
`;
