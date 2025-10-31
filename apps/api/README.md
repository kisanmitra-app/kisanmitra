# Kisan Mitra API Server

GraphQL and REST API server for the Kisan Mitra agricultural management platform.

## Overview

The API server provides a GraphQL endpoint for the mobile application and REST endpoints for authentication and file uploads. Built with Hono for high performance and Better Auth for secure authentication.

## Tech Stack

- **Framework**: [Hono](https://hono.dev/) - Ultra-fast web framework
- **GraphQL**: [@hono/graphql-server](https://github.com/honojs/middleware/tree/main/packages/graphql-server)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: [Better Auth](https://www.better-auth.com/)
- **Storage**: AWS S3 for file uploads
- **Logging**: Pino logger
- **Validation**: Zod schemas
- **Rate Limiting**: hono-rate-limiter

## Getting Started

### Prerequisites

- Node.js >= 20.x
- pnpm >= 9.x
- MongoDB >= 6.0 (running locally or remote)
- AWS S3 bucket (for file storage)

### Installation

1. **Navigate to the API directory**

   ```bash
   cd apps/api
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the `apps/api` directory, and refer to `.env.template` for required variables

4. **Start the development server**

   ```bash
   # Watch mode with auto-reload
   pnpm run watch

   # Or build and run
   pnpm run build
   pnpm run start
   ```

The API will be available at `http://localhost:8000`

## API Endpoints

### GraphQL Endpoint

```
POST http://localhost:8000/api/graphql
```

GraphQL Playground/Schema:

```
GET http://localhost:8000/api/graphql/schema
```

### REST Endpoints

#### Authentication

- `/api/auth/*` - Better Auth endpoints for sign-in, verify-otp, sign-out, session

#### File Upload

- `POST /api/upload` - Upload image to S3

## Project Structure

```
apps/api/
├── src/
│   ├── app.ts              # Hono app configuration
│   ├── index.ts            # Server entry point
│   ├── seed.ts             # Database seeding
│   ├── config/             # Configuration files
│   │   ├── auth.ts         # Better Auth configuration
│   │   ├── aws.ts          # AWS S3 configuration
│   │   └── db.ts           # MongoDB connection
│   ├── graphql/
│   │   ├── index.ts        # GraphQL server setup
│   │   ├── resolvers/      # GraphQL resolvers
│   │   └── typeDefs/       # GraphQL type definitions
│   ├── lib/                # Utility libraries
│   │   ├── logger.ts       # Pino logger setup
│   │   └── utils.ts        # Helper functions
│   ├── middlewares/        # Express/Hono middlewares
│   │   ├── auth.ts         # Authentication middleware
│   │   └── logging.ts      # Logging middleware
│   ├── routes/             # REST API routes
│   │   ├── index.ts
│   │   └── api/
│   │       ├── auth.ts     # Authentication routes
│   │       ├── graphql.ts  # GraphQL endpoint
│   │       └── upload.ts   # File upload routes
│   ├── services/           # Business logic services
│   │   ├── upload.ts       # S3 upload service
│   │   └── weather.ts      # Weather API service
│   └── types/              # TypeScript type definitions
│       └── index.ts
├── app.log                 # Application logs
├── error.log               # Error logs
├── package.json
├── tsconfig.json
└── tsup.config.ts          # Build configuration
```

## Monitoring

Logs are written to:

- `app.log` - General application logs
- `error.log` - Error logs only
