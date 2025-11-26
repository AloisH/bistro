# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bistro - Free, open-source Nuxt 4 starter kit for AI-powered SaaS products. MIT licensed alternative to paid starters ($149-$349).

**Stack:**
- Nuxt 4 (full-stack framework)
- Nuxt UI + Tailwind 4
- PostgreSQL + Prisma ORM
- Better Auth (email, OAuth, 2FA)
- Vercel AI SDK (OpenAI, Anthropic, local models)
- Polar (payments), Resend (email)
- Docker Compose (dev environment)

## Monorepo Structure

Bun workspaces with:
- `apps/web/` - Main Nuxt 4 SaaS application
- `apps/landing/` - Marketing site (planned, not yet implemented)
- `apps/docs/` - Documentation (planned, not yet implemented)
- `packages/` - Shared packages (planned: cli, ui, lib, database, config)

Currently only `apps/web` is implemented as Nuxt 4 starter.

## Development Commands

```bash
# Dev
bun dev                      # Start web app (port 3000)
bun dev:web                  # Same as above
bun dev:landing              # Landing site (port 3001) - not yet impl

# Database
bun db:migrate               # Run Prisma migrations (cd apps/web && bunx prisma migrate dev)
bun db:studio                # Open Prisma Studio UI
bun db:generate              # Generate Prisma Client

# Build
bun build                    # Build all apps

# Docker
docker compose up -d         # Start PostgreSQL + Redis
docker compose down          # Stop services

# Type checking & linting
cd apps/web && bun typecheck # Nuxt type checking
cd apps/web && bun lint      # ESLint
```

## Architecture

### apps/web Structure

Nuxt 4 app using new `/app` directory structure:
- `/app/app.vue` - Root component with UApp wrapper, header/footer
- `/app/pages/` - File-based routing
- `/app/components/` - Vue components (auto-imported)
- `/app/assets/` - Static assets
- `/server/` - Nitro server (API routes, middleware, utils)
- `/prisma/schema.prisma` - Database schema

### Database

Prisma with PostgreSQL. Schema includes:
- `User` - Auth with email, password, OAuth accounts
- `Account` - OAuth provider accounts
- `Session` - Auth sessions
- `Project` - User projects with slug, status
- `AIJob` - AI task tracking with input/output, tokens, cost

Prisma client: Import from `server/utils/db.ts` (singleton pattern with dev logging).

### Styling

- Tailwind 4 via Nuxt UI
- Color modes: Built-in dark mode support via `UColorModeButton`
- Components: Use Nuxt UI components (UApp, UHeader, UMain, UFooter, UButton, etc.)

### Environment

.env.example shows required vars:
- `DATABASE_URL` - PostgreSQL connection
- `AUTH_SECRET` - Better Auth secret
- `OPENAI_API_KEY`, `ANTHROPIC_API_KEY` - AI providers
- `POLAR_API_KEY`, `RESEND_API_KEY` - Payments/email
- `REDIS_URL` - Background jobs (optional)

## Key Patterns

1. **Server utils**: Use `server/utils/db.ts` for database access
2. **Auto-imports**: Components, composables auto-imported in Nuxt
3. **API routes**: Create in `server/api/` with `.get.ts`, `.post.ts` suffixes
4. **Type safety**: Prisma types + Nuxt TypeScript strict mode
5. **Composition API**: Vue 3 Composition API with `<script setup>`

## AI Integration Plan

Per README, planned AI workflows:
- Blog post generation
- Ad creative studio
- Landing page builder
- Email funnel designer
- Brand package creator
- Product idea validator

Use Vercel AI SDK for implementation.

## Notes

- Project early stage: Only web app skeleton exists
- Packages folder planned but empty
- No auth implementation yet (Better Auth dependency added)
- No payment integration yet (Polar planned)
- Docker Compose ready: postgres:16-alpine + redis:7-alpine
