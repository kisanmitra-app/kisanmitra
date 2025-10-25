import { gql } from "graphql-tag";

export const usersTypeDefs = gql`
  type User {
    id: ID!
    email: String
    name: String
    image: String
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    user: User
    userById(id: ID!): User
  }
`;
