import { gql } from "graphql-tag";

export const profilesTypeDefs = gql`
  type Location {
    type: String
    coordinates: [Float]
  }

  type Address {
    city: String
    region: String
    country: String
  }

  type Profile {
    id: ID!
    user: User!
    name: String
    location: Location
    address: Address

    createdAt: String
    updatedAt: String
  }

  type Query {
    profile(id: ID): Profile
  }

  input LocationInput {
    type: String
    coordinates: [Float]
  }

  input AddressInput {
    city: String
    region: String
    country: String
  }

  input UpdateProfileInput {
    name: String
    location: LocationInput
    address: AddressInput
  }

  type Mutation {
    updateProfile(input: UpdateProfileInput!): Profile
  }
`;
