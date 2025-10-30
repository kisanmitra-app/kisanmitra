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

  type SeasonalForecast {
    period: String
    expectedDemand: String
    suggestedActions: [String]
  }

  type CropCycleInsight {
    crop: String
    cycle: String
    inventoryNeeds: [String]
  }

  type ProcurementPlanItem {
    item: String
    currentQuantity: String
    recommendedQuantity: String
    timing: String
    rationale: String
  }

  type AiInventorySummary {
    recommendations: [String]
    seasonalForecasts: [SeasonalForecast]
    cropCycleInsights: [CropCycleInsight]
    procurementPlan: [ProcurementPlanItem]
    yieldImprovementTips: [String]
  }

  type Profile {
    id: ID!
    user: User!
    name: String
    location: Location
    address: Address
    aiInventorySummary: AiInventorySummary

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
