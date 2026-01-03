# Web App Context (apps/web/)

Main Nuxt 4 application. Entry point for Bistro SaaS starter.

## Purpose

Production-ready SaaS boilerplate with:

- Authentication (Better Auth: email/password + OAuth)
- Multi-tenancy (Organizations with RBAC)
- Database (Prisma 7 + PostgreSQL)
- Example feature (Todo CRUD)
- Testing & CI/CD
- Docker dev + prod

## Quick Reference

**Start development:**

```bash
# From repo root (NOT apps/web/)
docker compose up -d       # Start postgres + redis
bun db:migrate            # Run migrations
bun dev                   # Start on :3000
```

**Common tasks:**

```bash
bun db:migrate            # Apply schema changes
bun db:generate           # Regenerate Prisma types
bun db:studio             # Open Prisma Studio
bun test                  # Run tests (watch)
bun test:run              # Run once
bun lint                  # Check code
bun typecheck             # Check types
bun build                 # Production build
```

## Configuration Files

**nuxt.config.ts:**

- Modules: @nuxt/eslint, @nuxt/ui
- Runtime config (env vars, publicRoutes)
- Route rules (prerendering)
- ESLint stylistic config (1tbs)

**prisma.config.ts:**

- Custom Prisma config location
- Fallback DATABASE_URL if not in env

**vitest.config.ts:**

- Environment: 'nuxt' with 'happy-dom'
- Coverage: v8 provider
- Excludes: .nuxt, node_modules, dist, config files, prisma/

**eslint.config.mjs:**

- Extends .nuxt/eslint.config.mjs
- Disables vue/multi-word-component-names
- Enforces trailing commas (multiline)
- Ignores coverage/, prisma/generated/

## Environment Variables

**Required (.env):**

```bash
DATABASE_URL=postgresql://bistro:bistro@localhost:5432/bistro
AUTH_SECRET=your-secret-key-change-in-production
```

**Optional OAuth (.env):**

```bash
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

**Docker production (.env.docker):**

```bash
DATABASE_URL=postgresql://bistro:bistro@postgres:5432/bistro
# Note: postgres hostname (NOT localhost)
```

## Directory Structure

**See subdirectory CLAUDE.md files:**

- `server/CLAUDE.md` - API routes, auth, DB
- `app/CLAUDE.md` - Pages, components, composables

```
apps/web/
├── CLAUDE.md            # This file
├── app/
│   ├── CLAUDE.md        # App context
│   ├── app.vue
│   ├── pages/
│   ├── components/
│   ├── composables/
│   ├── middleware/
│   └── assets/
├── server/
│   ├── CLAUDE.md        # Server context
│   ├── api/
│   └── utils/
├── lib/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── generated/       # Gitignored
├── nuxt.config.ts
├── vitest.config.ts
└── eslint.config.mjs
```

## Dependency Management

**Key packages:**

- `nuxt@^4.0.0` - Framework
- `@nuxt/ui@^2.22` - Component library
- `@prisma/client@^7.4` - Database ORM
- `@prisma/adapter-pg@^7.4` - Postgres adapter
- `better-auth@^1.4` - Authentication
- `pg@^8.13` - Postgres driver
- `zod@^3.25` - Validation
- `vitest@^3.0` - Testing

**Update dependencies:**

```bash
bun update            # Update all
bun add <pkg>@latest  # Update specific
```

## Testing Strategy

**Unit tests:**

- Place next to files: `Component.test.ts`
- Mock external dependencies (Prisma, etc)
- Focus on logic, not implementation

**Integration tests:**

- API routes with mock DB
- Component interactions
- Auth flows

**E2E tests (future):**

- Playwright for critical paths
- Login → Onboarding → Organization → Todos

## Build & Deployment

**Local production test:**

```bash
bun build                 # Build .output/
bun docker:prod           # Build & run Docker
bun docker:prod:logs      # View logs
```

**CI (GitHub Actions):**

1. Lint (ESLint + Prettier)
2. Typecheck (with Prisma generate)
3. Test (Vitest + coverage)
4. Build (Nuxt)
5. Docker (Build image)

**Deployment targets:**

- Vercel (recommended)
- Railway
- Render
- Self-hosted (Docker)

## Gotchas Specific to Web App

**Monorepo commands:**

- Always from root, NOT apps/web/
- Root scripts use `--filter=web`
- Actual scripts in apps/web/package.json

**Prisma location:**

- Schema: `prisma/schema.prisma`
- Generated: `prisma/generated/` (gitignored)
- Migrations: `prisma/migrations/`

**Auth client vs server:**

- Server: `server/utils/auth.ts` (betterAuth config)
- Client: `lib/auth-client.ts` (unused, prefer useAuth composable)
- Composable: `app/composables/useAuth.ts` (use this)

**Runtime config:**

- Server: `runtimeConfig.authSecret`
- Public: `runtimeConfig.public.oauthGithubEnabled`, `runtimeConfig.public.publicRoutes`
- Access: `useRuntimeConfig()`
