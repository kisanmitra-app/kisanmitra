import gql from "graphql-tag";

export const scansTypeDefs = gql`
  type AiInsights {
    summary: String
    recommendations: [String]
  }

  type ScanResult {
    defectType: String
    severity: String
    confidence: Float
  }

  type Scan {
    id: ID!
    user: User!
    upload: Upload!
    scannedAt: String
    aiInsights: AiInsights
    results: [ScanResult]
    createdAt: String
    updatedAt: String
  }

  type Query {
    getScans: [Scan!]
    getScanById(id: ID!): Scan
  }

  type Mutation {
    createScan(uploadId: ID!): Scan
  }
`;
