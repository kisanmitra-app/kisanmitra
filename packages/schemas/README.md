# @kisan-mitra/schemas

Shared MongoDB/Mongoose schemas and TypeScript types used across the Kisan Mitra monorepo.

## Overview

This package contains all the database schemas, models, and TypeScript interfaces shared between the API server and Workers service. It ensures consistency in data structures across the application.

## Tech Stack

- **ORM**: Mongoose (MongoDB)
- **Language**: TypeScript
- **Build Tool**: tsup
- **Package Manager**: pnpm workspace

## Installation

This package is part of the pnpm workspace and is consumed by other apps:

```json
{
  "dependencies": {
    "@kisan-mitra/schemas": "workspace:*"
  }
}
```

## Project Structure

```
packages/schemas/
├── src/
│   ├── index.ts            # Main exports
│   ├── types.ts            # Shared TypeScript types
│   ├── interfaces/         # TypeScript interfaces
│   │   └── ...
│   └── models/             # Mongoose models
│       ├── index.ts
│       ├── user.model.ts
│       ├── ... (other models)
│       └── plugins/        # Mongoose plugins
├── dist/                   # Compiled output
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

## Data Models

- user (represents application users)
- profile (extended user info)
- category (product categories)
- product (agricultural products)
- inventory (product inventory tracking)
- usage (product usage records)
- scan (plant disease scans)
- upload (file uploads to S3)
- notification (push notifications)

## Development

### Adding a New Model

1. **Create the model file**

```typescript
// src/models/farm.model.ts
import { Schema, model } from "mongoose";
import type { IFarm } from "../interfaces";

const farmSchema = new Schema<IFarm>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    size: { type: Number },
    // ... other fields
  },
  {
    timestamps: true,
  }
);

export const Farm = model<IFarm>("Farm", farmSchema);
```

2. **Export from index**

```typescript
// src/models/index.ts
export * from "./farm.model";
```

3. **Rebuild the package**

```bash
pnpm run build
```

## Publishing

This is a private workspace package and is not published to npm. It's consumed directly via pnpm workspace protocol:

```json
"@kisan-mitra/schemas": "workspace:*"
```
