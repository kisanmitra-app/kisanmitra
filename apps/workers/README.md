# Kisan Mitra Workers

Background job processing service for handling asynchronous tasks like AI predictions, notifications, and scheduled updates.

## Overview

The workers service handles background processing for the Kisan Mitra platform using BullMQ and Redis. It processes tasks such as plant disease predictions using AI, inventory summaries, weather updates, and push notifications.

## Tech Stack

- **Framework**: Node.js with TypeScript
- **Queue**: [BullMQ](https://docs.bullmq.io/) - Fast and robust queue system
- **Cache/Queue Store**: Redis
- **Database**: MongoDB with Mongoose
- **AI**: Google Gemini AI (via Vercel AI SDK)
- **Storage**: AWS S3 for image processing
- **Logging**: Pino logger

## Getting Started

### Prerequisites

- Node.js >= 20.x
- pnpm >= 9.x
- Redis >= 7.0 (running locally or remote)
- MongoDB >= 6.0
- Google Gemini API key
- AWS S3 access

### Installation

1. **Navigate to the workers directory**

   ```bash
   cd apps/workers
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the `apps/workers` directory, and refer to `.env.template` for required variables

4. **Start the development server**

   ```bash
   # Watch mode with auto-reload
   pnpm run watch

   # Or build and run
   pnpm run build
   pnpm run start
   ```

## Job Queues

### 1. Weather Update Queue

Periodically fetches and updates weather data for user locations.

**Job Name**: `weather-update`
**Schedule**: Every 30 minutes (configurable)
**Processing**:

- Fetches weather data from external API
- Updates user's location weather information
- Stores in MongoDB for quick access

### 2. Inventory Summary Queue

Generates AI-powered inventory summaries and recommendations.

**Job Name**: `inventory-summary`
**Trigger**: On-demand or scheduled
**Processing**:

- Analyzes user's inventory data
- Uses Google Gemini AI to generate insights
- Provides recommendations for:
  - Product usage optimization
  - Restocking suggestions
  - Seasonal recommendations
  - Cost optimization tips

### 3. Disease Prediction Queue (Planned)

Processes uploaded plant images for disease detection.

**Job Name**: `disease-prediction`
**Trigger**: On image upload
**Processing**:

- Downloads image from S3
- Runs through ML model
- Generates disease prediction
- Uses AI to provide treatment recommendations

## Project Structure

```
apps/workers/
├── src/
│   ├── index.ts              # Main entry point
│   ├── config/               # Configuration files
│   │   ├── redis.ts          # Redis connection
│   │   └── db.ts             # MongoDB connection
│   ├── lib/                  # Utility libraries
│   │   ├── ai.ts             # AI SDK helpers
│   │   ├── logger.ts         # Pino logger
│   │   └── utils.ts          # Helper functions
│   ├── queues/               # Queue definitions
│   └── workers/              # Worker processors
├── app.log                   # Application logs
├── error.log                 # Error logs
├── package.json
├── tsconfig.json
└── tsup.config.ts            # Build configuration
```

### Job States

- **Waiting**: Job is in queue, waiting to be processed
- **Active**: Job is currently being processed
- **Completed**: Job finished successfully
- **Failed**: Job encountered an error
- **Delayed**: Job is scheduled for future execution

## AI Integration

### Google Gemini AI

The workers use Google's Gemini AI for:

1. **Inventory Analysis**

   - Smart categorization
   - Usage pattern analysis
   - Predictive recommendations

2. **Disease Treatment Recommendations**

   - Context-aware treatment suggestions
   - Organic vs chemical options
   - Prevention strategies

3. **Agricultural Insights**
   - Weather-based farming tips
   - Seasonal crop recommendations
   - Resource optimization

### Example AI Usage

```typescript
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

const { text } = await generateText({
  model: google("gemini-1.5-flash"),
  prompt: `Analyze this inventory data and provide recommendations: ${data}`,
});
```

## Adding New Jobs

### 1. Create Queue Definition

```typescript
// src/queues/my-job.queue.ts
import { Queue } from "bullmq";
import { redis } from "../config/redis";

export const myJobQueue = new Queue("my-job", {
  connection: redis,
});

export const myJobQueueHelpers = {
  addJob: async (data: any) => {
    await myJobQueue.add("process", data);
  },
};
```

### 2. Create Worker

```typescript
// src/workers/my-job.worker.ts
import { Worker, Job } from "bullmq";
import { redis } from "../config/redis";
import { logger } from "../lib/logger";

export const myJobWorker = new Worker(
  "my-job",
  async (job: Job) => {
    logger.info(`Processing job ${job.id}`);

    // Your processing logic here
    const result = await processData(job.data);

    return result;
  },
  {
    connection: redis,
    concurrency: 5, // Number of parallel jobs
  }
);

myJobWorker.on("completed", (job) => {
  logger.info(`Job ${job.id} completed`);
});

myJobWorker.on("failed", (job, err) => {
  logger.error(`Job ${job?.id} failed: ${err.message}`);
});
```

### 3. Register Queue and Worker

```typescript
// src/queues/index.ts
export * from "./my-job.queue";

// src/workers/index.ts
export * from "./my-job.worker";
```

## Configuration

### Queue Options

```typescript
{
  connection: redis,
  defaultJobOptions: {
    attempts: 3,              // Retry failed jobs 3 times
    backoff: {
      type: 'exponential',
      delay: 2000,            // Start with 2s delay
    },
    removeOnComplete: true,   // Clean up completed jobs
    removeOnFail: false,      // Keep failed jobs for debugging
  },
}
```

### Worker Options

```typescript
{
  connection: redis,
  concurrency: 5,             // Process 5 jobs in parallel
  limiter: {
    max: 10,                  // Max 10 jobs
    duration: 1000,           // Per second
  },
}
```

## Monitoring

### Logging

All jobs are logged with:

- Job ID
- Job name
- Processing time
- Success/failure status
- Error messages (if failed)

Logs are written to:

- `app.log` - All logs
- `error.log` - Error logs only
