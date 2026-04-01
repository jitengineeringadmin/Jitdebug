# JIT Debug

JIT Debug is a professional B2B SaaS platform for managing debug workflows, incidents, test runs, and system logs.

## Architecture

This project is structured as a **monorepo** using npm workspaces.

- **`apps/api`**: NestJS backend. Provides RESTful APIs, handles authentication, and connects to PostgreSQL via Prisma.
- **`apps/web`**: Next.js 15 App Router frontend. Provides the user interface, styled with Tailwind CSS and shadcn/ui.
- **`packages/shared`**: Shared TypeScript definitions, enums, and DTOs used by both frontend and backend.

## Prerequisites

- Node.js (v20+)
- Docker & Docker Compose (for PostgreSQL)

## Local Development Setup

1. **Start the database**
   ```bash
   docker-compose up -d
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build shared packages**
   ```bash
   npm run build -w packages/shared
   ```

4. **Apply database migrations and seed data**
   ```bash
   npm run prisma:migrate
   npm run seed
   ```

5. **Start the development servers**
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api

## Seed Credentials

The database is seeded with the following users (password for all is `password123`):
- `super@jitdebug.com` (Super Admin)
- `admin@jitdebug.com` (Admin)
- `analyst@jitdebug.com` (Analyst)
