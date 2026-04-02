# JIT Debug

Professional B2B SaaS Debugging & Incident Management Platform.

## Architecture

- **Backend**: NestJS (apps/api)
- **Frontend**: Next.js (apps/web)
- **Shared**: TypeScript Types & Enums (packages/shared)
- **Database**: PostgreSQL with Prisma ORM

## Features

- **Multi-tenant Workspace Isolation**: All data is strictly isolated by `workspaceId`.
- **Professional Auth**: JWT with Refresh Tokens (persisted in DB), HttpOnly cookies, and RBAC.
- **Project Management**: GitHub-centric project tracking with sync status.
- **Incident Management**: Severity-based incident tracking with notes and AI-ready hooks.
- **Workflow Monitoring**: Track debug targets across different systems and environments.
- **Audit Trail**: Full administrative and security logging.
- **Health Monitoring**: Real-time service status.

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm
- Docker (for PostgreSQL)

### Installation

```bash
pnpm install
```

### Database Setup

1. Start PostgreSQL:
```bash
docker-compose up -d
```

2. Run migrations:
```bash
pnpm prisma:migrate
```

3. Seed the database:
```bash
pnpm seed
```

### Development

```bash
pnpm dev
```

- API: http://localhost:3000
- Web: http://localhost:3001

## Seed Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@jitdebug.com | password123 |
| Admin | admin@jitdebug.com | password123 |
| Analyst | analyst@jitdebug.com | password123 |

## Checklist

- [x] pnpm Workspaces
- [x] PostgreSQL Integration
- [x] JWT + Refresh Token Auth
- [x] Workspace Isolation
- [x] Projects Module (GitHub-centric)
- [x] Settings Module
- [x] Audit Module
- [x] Health Module
- [x] Comprehensive Seed
- [x] Professional UI (Tailwind + Dark Mode)
