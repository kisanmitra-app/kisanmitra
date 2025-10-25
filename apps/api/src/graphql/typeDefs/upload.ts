import gql from "graphql-tag";

export const uploadsTypeDefs = gql`
  type Upload {
    id: ID!
    filename: String!
    mimetype: String!
    height: Int
    width: Int
    url: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    uploadById(id: ID!): Upload
  }
`;
