# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project Overview

Bistro - Free MIT-licensed Nuxt 4 starter for AI-powered SaaS. Alternative to paid starters ($149-$349).

**Stack:**

- Nuxt 4 + Nuxt UI v4 + Tailwind 4
- PostgreSQL + Prisma 7 (with @prisma/adapter-pg)
- Better Auth (email/password + OAuth providers)
- Vercel AI SDK (OpenAI, Anthropic, local models)
- Polar (payments), Resend (email)
- Docker Compose (dev + prod)
- Vitest + Testing Library

## Monorepo Structure

Bun workspaces:

- `apps/web/` - Main Nuxt 4 app (implemented)
- `apps/landing/` - Marketing site (placeholder)
- `packages/cli/` - CLI tool (placeholder)

Only `apps/web` has implementation. Other workspaces are empty directories.

## Development Commands

**ALWAYS run from project root, not subdirectories.**

```bash
# Dev
bun dev                      # Start web (port 3000)
bun dev:web                  # Alias for above

# Database
bun db:migrate               # Prisma migrations
bun db:studio                # Prisma Studio UI
bun db:generate              # Generate Prisma Client

# Testing
bun test                     # Vitest watch mode
bun test:run                 # Run tests once
bun test:ui                  # Vitest UI
bun test:coverage            # Generate coverage report

# Quality checks
bun typecheck                # TypeScript check
bun lint                     # ESLint
bun lint:fix                 # ESLint auto-fix
bun format                   # Prettier format
bun format:check             # Prettier check

# Build
bun build                    # Build web app

# Docker
docker compose up -d         # Start postgres + redis (dev)
docker compose down          # Stop services
bun docker:prod              # Build + run production Docker
bun docker:prod:up           # Run production detached
bun docker:prod:down         # Stop production
bun docker:prod:logs         # View production logs
```

**Environment:**

- `.env` in root for local dev (DATABASE_URL=localhost)
- `.env.docker` for production Docker (DATABASE_URL=postgres hostname)
- Fallback in `apps/web/prisma.config.ts` if env var missing

**Monorepo:**

- Root scripts delegate via `bun run --filter=web <cmd>`
- Actual commands in `apps/web/package.json`
- Use `--elide-lines=0` for full logs (default truncates at 10 lines)

## GitHub Workflow

**Issue commands:**

```bash
gh issue list                    # All open
gh issue list --label phase-1    # Filter by phase
gh issue view 24                 # View detail
/issue                          # Create via slash command
```

**Standard flow:**

1. Pick issue (`gh issue list`, prioritize phase-1)
2. Plan with `/plan-issue <number>` (fetches, explores, creates plan in `~/.claude/plans/`)
3. Get approval, implement following plan
4. Test thoroughly (`bun test:run`, `bun lint`, `bun typecheck`)
5. Commit with `/commit` (stages files, conventional message)
6. Push & PR: `git push origin main` or create branch + `gh pr create --body "Fixes #24"`

**Commit format:** `type(scope): description`

Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `ci`

**Labels:**

- Phase: `phase-1/2/3/4`
- Type: `feature`, `bug`, `docs`, `chore`
- Area: `auth`, `database`, `ai`, `ui`, `ci-cd`

**CI Pipeline (.github/workflows/ci.yml):**

Runs on push/PR to main/develop:

1. Lint (ESLint + Prettier)
2. Typecheck (TypeScript + Prisma generate)
3. Test (Vitest + coverage → Codecov)
4. Build (Nuxt build + artifact upload)
5. Docker (Build production image)

**Git Hooks:**

Pre-commit: `simple-git-hooks` + `lint-staged` (ESLint fix on .ts/.vue, Prettier on .json/.md/.css)

## Architecture

### apps/web Structure

```
apps/web/
├── app/
│   ├── app.vue              # Root (UApp wrapper, header/footer)
│   ├── pages/               # File-based routes
│   ├── components/          # Vue components (auto-imported)
│   ├── composables/         # useAuth.ts
│   ├── middleware/          # auth.global.ts (route protection)
│   └── assets/              # Static files
├── server/
│   ├── api/                 # API routes
│   └── utils/               # auth.ts, serverAuth.ts, db.ts
├── lib/                     # auth-client.ts (Better Auth client)
├── prisma/schema.prisma     # Database schema
└── vitest.config.ts         # Test config
```

### Database (Prisma 7 + PostgreSQL)

**Schema models:**

- `User` - Email, password, OAuth accounts
- `Account` - OAuth provider links
- `Session` - Auth sessions (token, expiry, user agent)
- `Project` - User projects (slug, status)
- `AIJob` - AI tasks (type, input/output, tokens, cost, duration)

**Import:** Use `server/utils/db.ts` singleton (Prisma Client with dev logging + @prisma/adapter-pg)

### Styling

- Tailwind 4 via Nuxt UI v4
- Dark mode: `UColorModeButton` (built-in)
- Components: `UApp`, `UHeader`, `UMain`, `UFooter`, `UButton`, etc.

### Environment Variables

Required (`.env`):

- `DATABASE_URL` - PostgreSQL (localhost for dev, postgres for docker)
- `AUTH_SECRET` - Better Auth key
- `OPENAI_API_KEY`, `ANTHROPIC_API_KEY` - AI providers
- `POLAR_API_KEY`, `POLAR_WEBHOOK_SECRET` - Payments
- `RESEND_API_KEY` - Email

Optional:

- `REDIS_URL` - Background jobs
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage
- `S3_*` - S3-compatible storage
- `SENTRY_DSN`, `SENTRY_AUTH_TOKEN` - Observability

## Key Patterns

1. **DB access**: Import from `server/utils/db.ts` (singleton)
2. **Auto-imports**: Components, composables auto-imported
3. **API routes**: `server/api/` with `.get.ts`, `.post.ts` suffixes
4. **Type safety**: Prisma types + strict TypeScript
5. **Composition API**: Vue 3 `<script setup>`
6. **Testing**: Vitest + happy-dom, place `.test.ts` next to files

## Authentication

Better Auth (email/password implemented, OAuth planned):

- **Server**: `server/utils/auth.ts` (Better Auth + Prisma adapter), `server/utils/serverAuth.ts` (session helper)
- **Client**: `lib/auth-client.ts` (Better Auth client), `app/composables/useAuth.ts` (session state)
- **Routes**: `/auth/login`, `/auth/register`, `/dashboard` (protected)
- **Middleware**: `app/middleware/auth.global.ts` (route guard)
- **Component**: `AuthButton` (header login/avatar dropdown)

## AI Workflows (Planned)

Using Vercel AI SDK:

- Blog post generation
- Ad creative studio
- Landing page builder
- Email funnel designer
- Brand package creator
- Product idea validator

## Project Status

**Implemented:**

- ✅ Nuxt 4 app structure
- ✅ Database (Prisma 7 + PostgreSQL)
- ✅ Auth (Better Auth email/password)
- ✅ Testing (Vitest + coverage)
- ✅ CI/CD (GitHub Actions)
- ✅ Docker (dev + prod)
- ✅ Git hooks (lint-staged)

**Planned:**

- ⏳ OAuth providers (GitHub, Google)
- ⏳ Payment integration (Polar)
- ⏳ Email templates (Resend)
- ⏳ AI workflows (Vercel AI SDK)
- ⏳ Landing site (`apps/landing`)
- ⏳ CLI tool (`packages/cli`)
