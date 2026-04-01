# JIT Debug

JIT Debug is a professional B2B SaaS platform for managing debug workflows, incidents, test runs, and system logs.

## Architecture

- **Monorepo**: Single repository containing both frontend and backend.
- **Frontend**: Next.js 15 (App Router), Tailwind CSS v4, shadcn/ui.
- **Backend**: NestJS, Prisma ORM.
- **Database**: SQLite (for local development/preview), easily migratable to PostgreSQL.
- **Auth**: JWT with HttpOnly cookies and Refresh Tokens.

## Getting Started

### Prerequisites
- Node.js 20+
- npm or pnpm

### Setup

1. Copy the environment variables:
   ```bash
   cp .env.example .env
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup the database:
   ```bash
   npm run prisma:push
   npm run seed
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

### Default Credentials (from seed)
- **Super Admin**: `super@jitdebug.com` / `password123`
- **Admin**: `admin@jitdebug.com` / `password123`
- **Analyst**: `analyst@jitdebug.com` / `password123`

## Project Structure
- `src/api`: NestJS backend application.
- `src/app`: Next.js frontend application.
- `src/components`: Shared React components.
- `src/lib`: Shared utilities.
- `prisma`: Database schema and seed scripts.
