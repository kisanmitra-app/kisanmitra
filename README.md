# Kisan Mitra - Capstone Project

A comprehensive plant disease identification and farm management system powered by AI and machine learning.

## Overview

Kisan Mitra is an integrated platform designed to help farmers identify plant diseases, manage their agricultural operations, and get AI-powered recommendations. The system consists of multiple microservices working together to provide a seamless experience.

**Project Components:**

- **API Server** - GraphQL/REST API for the mobile application
- **Workers** - Background job processors for AI predictions and notifications
- **Training Model** - CNN-based plant disease classification model
- **Shared Schemas** - MongoDB/Mongoose schemas shared across services
- **Mobile App** - React Native/Expo mobile application [capstone-frontend](https://github.com/susmitadas22/capstone-frontend)

## Architecture

```
capstone/
├── apps/
│   ├── api/              # Main API server (Hono + GraphQL)
│   ├── workers/          # Background workers (BullMQ + AI SDK)
│   └── training-model/   # ML model training (TensorFlow/Keras)
├── packages/
│   └── schemas/          # Shared Mongoose schemas
└── models/               # Trained ML models and datasets
```

## Quick Start

### Prerequisites

- **Node.js** >= 20.x
- **pnpm** >= 9.x
- **Python** 3.10+
- **MongoDB** >= 6.0 (running locally or remote, atlas is recommended)
- **Redis** >= 7.0 (for workers)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/susmitadas22/capstone.git
   cd capstone
   ```

2. **Install dependencies**

   ```bash
   # Install Node.js dependencies
   pnpm install

   # Install Python dependencies (for training model)
   pip install -r requirements.txt
   ```

3. **Set up environment variables**

   Create `.env` files in each app directory, and configure as needed (see individual `.env.template` files).

4. **Start development servers**

   ```bash
   # Start all services in watch mode
   pnpm run watch

   # Or start individually:
   pnpm run watch:api    # API server on port 8000

   # In separate terminals:
   cd apps/workers && pnpm run watch
   ```

## Workspace Structure

This is a **pnpm workspace** monorepo with the following packages:

### Applications (`apps/`)

| App                | Description                           | Tech Stack                          |
| ------------------ | ------------------------------------- | ----------------------------------- |
| **api**            | Main API server with GraphQL endpoint | Hono, GraphQL, MongoDB, Better Auth |
| **workers**        | Background job processors             | BullMQ, Redis, Gemini AI, AWS S3    |
| **training-model** | ML model training pipeline            | TensorFlow, Keras, Python           |

### Packages (`packages/`)

| Package     | Description                       | Usage                   |
| ----------- | --------------------------------- | ----------------------- |
| **schemas** | Shared Mongoose schemas and types | Used by API and Workers |

## Development

### Building Packages

Before running the apps, build shared packages:

```bash
pnpm run build:packages
```

### Watch Mode

For development with auto-reload:

```bash
# Watch all packages and apps
pnpm run watch

# Watch only API
pnpm run watch:api
```

## Mobile Application

The mobile application is in a separate workspace: [capstone-frontend](https://github.com/susmitadas22/capstone-frontend)

See [capstone-frontend/README.md](https://github.com/susmitadas22/capstone-frontend/blob/main/README.md) for setup and development instructions.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Apache-2.0 License - see [LICENSE](LICENSE) file for details.

## Author

- Susmita Das - [GitHub](https://github.com/susmitadas22)
- Jabed Zaman - [GitHub](https://github.com/jabedzaman)
- Shivam Rana - [GitHub](https://github.com/samurana39-cpu)
- Herender Kumar - [GitHub](https://github.com/HerenderKumar)
- Nishant Kumar - [GitHub](https://github.com/Nishantkumar001)
- Piyush Dhiman - [GitHub](https://github.com/PiyushDhiman17)

## Issues

Report bugs and issues at: [https://github.com/susmitadas22/capstone/issues](https://github.com/susmitadas22/capstone/issues)

## Documentation

- [API Documentation](apps/api/README.md)
- [Workers Documentation](apps/workers/README.md)
- [Training Model Documentation](apps/training-model/README.md)
- [Schemas Documentation](packages/schemas/README.md)
- [Frontend Documentation](https://github.com/susmitadas22/capstone-frontend)
