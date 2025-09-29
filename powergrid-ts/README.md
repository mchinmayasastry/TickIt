# POWERGRID Unified Ticketing System (PUTS)

A unified ticketing system for POWERGRID that consolidates IT support requests from multiple platforms into a single, AI-powered interface.

## Features

- **Unified Ticket Management**: Centralized view of all IT support tickets
- **AI-Powered Classification**: Automatic categorization of incoming tickets
- **Multi-Channel Support**: Web, mobile, and chatbot interfaces
- **Self-Service Portal**: Knowledge base and automated resolutions
- **Real-time Notifications**: Email and SMS alerts

## Project Structure

```
powergrid-ts/
├── backend/           # Backend API server (Node.js/TypeScript)
├── frontend/          # Frontend application (to be implemented)
├── docs/              # Documentation
└── scripts/           # Utility scripts
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher) or yarn
- PostgreSQL (for database)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory and configure the environment variables (use `.env.example` as a reference).

4. Start the development server:
   ```bash
   npm run dev
   ```

5. The API will be available at `http://localhost:5000`

### Frontend Setup

Frontend setup instructions will be added soon.

## Development

- Run linter: `npm run lint`
- Format code: `npm run format`
- Run tests: `npm test`

## License

This project is proprietary and confidential. All rights reserved.
