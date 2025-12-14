# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Working with Claude Code

**Before You Start:**

- Read entire CLAUDE.md first time in project
- Use `/plan-issue <number>` for complex features (creates detailed plan in ~/.claude/plans/)
- Check existing patterns before creating new ones (Glob + Grep)
- Run `/check` before commits (lint, typecheck, build, tests)

**Communication:**

- Extremely concise per user preference
- Sacrifice grammar for conciseness
- No emojis in responses
- Always use absolute paths in responses

**Workflow:**

1. Explore with Read, Glob, Grep (NEVER modify in plan mode)
2. Find similar patterns in codebase
3. Propose approach, get approval
4. Implement following established conventions
5. Test thoroughly before committing
6. Use `/commit` for conventional commit messages

**Check Before Create:**

- Search for existing patterns: `grep -r "pattern" apps/web/`
- Find similar files: `find apps/web -name "*auth*"`
- Read related code before implementing
- Prefer extending existing over creating new

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

**CRITICAL - Shared Code Location:**

- ✅ Schemas go in `apps/web/shared/schemas/` (inside web app, next to server/ folder)
- ❌ NOT in monorepo root `/home/alois/bistro/shared/` (doesn't exist)
- Import via `#shared/schemas/user` alias (configured in nuxt.config.ts)
- Alias: `#shared` → `apps/web/shared/`

## Philosophy

**KISS (Keep It Simple):**

- Use Nuxt/Prisma conventions, no custom abstractions
- Leverage Better Auth defaults, minimal config
- Standard file-based routing, no complex route configs
- Example: useAuth composable wraps Better Auth client directly, no extra layers

**DRY (Don't Repeat):**

- DB singleton pattern (`server/utils/db.ts`) prevents multiple Prisma instances
- useAuth composable centralizes auth logic
- Auto-imports eliminate repetitive import statements
- Shared Prettier/ESLint configs for all workspaces
- publicRoutes centralized in nuxt.config.ts (single source of truth)

**YAGNI (You Aren't Gonna Need It):**

- No unused workspace packages (landing/cli are placeholders)
- No premature optimization (add caching when needed)
- OAuth optional (only enabled if env vars present)
- No complex state management (useState sufficient)

## Code Conventions

**Formatting (Prettier):**

- No semicolons
- Single quotes
- Trailing commas (multiline)
- 100 char line width
- 2 space tabs
- See prettier.config.js

**Vue:**

- `<script setup>` Composition API only
- Multi-word component names optional (disabled in ESLint)
- Place tests next to components: `Component.test.ts`
- Use Nuxt UI components (UButton, UCard, etc)

**TypeScript:**

- Strict mode enabled
- Use Prisma-generated types
- Zod schemas for form validation
- Type imports: `import type { ... }`

**File Naming:**

- Components: PascalCase (`AuthButton.vue`)
- Composables: camelCase with 'use' prefix (`useAuth.ts`)
- API routes: kebab-case with method suffix (`user.get.ts`)
- Pages: kebab-case or index.vue

**Imports:**

- Server utils: Explicit imports (`import { db } from '~/server/utils/db'`)
- Components/composables: Auto-imported (no import needed)
- External packages: Standard imports
- Shared schemas: Use `#shared` alias (`import { roleSchema } from '#shared/schemas/role'`)

**Nuxt Aliases:**

- `~` or `@` - Project root (apps/web/)
- `#shared` - Shared directory (./shared from apps/web, next to server/)
- Auto-configured in nuxt.config.ts

**Banned Patterns:**

- ❌ `new PrismaClient()` - Use singleton from db.ts
- ❌ Class components - Use `<script setup>` only
- ❌ Options API - Use Composition API only
- ❌ Multiple PrismaClient instances - Connection pool exhaustion

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

**Planning:**

- Complex features: Use `/plan-issue <number>`
- Plans saved to `~/.claude/plans/` for reference
- Review plan before executing
- Update plan if requirements change

**Context Loading:**

- Read relevant context-specific CLAUDE.md first
- Explore existing patterns in that area
- Check for gotchas in root CLAUDE.md

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

## Common Gotchas

**Database:**

- ❌ `new PrismaClient()` - Creates multiple connections
- ✅ `import { db } from '~/server/utils/db'` - Use singleton
- Must use PrismaPg adapter with pg.Pool (Prisma 7 requirement)
- Run `bun db:generate` after schema changes, before typecheck
- Generated client in `prisma/generated/`, gitignored

**Authentication:**

- Session cache is 5 min - may see stale session briefly after updates
- OAuth buttons only show if env vars configured (runtime check)
- Public routes centralized in `nuxt.config.ts` runtimeConfig.public.publicRoutes
- Add new public routes to config, NOT middleware (middleware reads from config)
- After OAuth callback, must call `fetchSession()` to populate state
- Better Auth uses catch-all route: `/api/auth/[...]`

**Monorepo:**

- Always run commands from root, NOT subdirectories
- Root scripts delegate via `bun run --filter=web <cmd>`
- Use `--elide-lines=0` for full logs (default truncates at 10)
- Actual scripts defined in `apps/web/package.json`

**Testing:**

- Must mock @prisma/client, @prisma/adapter-pg, pg modules
- Use `vi.resetModules()` in beforeEach for clean state
- Environment: 'nuxt' with domEnvironment: 'happy-dom'
- Tests run in Vitest, NOT Jest
- Place tests next to files: `Component.test.ts`

**Docker:**

- Local dev: DATABASE_URL=localhost:5432
- Docker prod: DATABASE_URL=postgres:5432 (hostname differs!)
- Use .env for local, .env.docker for production
- Must `bun db:generate` in migrations image before build

**Auto-imports:**

- Components in `app/components/` auto-imported
- Composables in `app/composables/` auto-imported
- Nuxt utils (useRoute, useState, etc) auto-imported
- If confused about source, check `.nuxt/` generated imports

## Troubleshooting

**"Cannot find module '@prisma/client'"**

```bash
bun db:generate  # Generate Prisma Client
```

**"Database connection failed"**

```bash
docker compose up -d  # Start postgres
# Check DATABASE_URL matches docker-compose.yml credentials
```

**"OAuth buttons not showing"**

```bash
# Add to .env:
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
# Restart dev server
```

**"Session not updating after login"**

```typescript
// Must call fetchSession() after auth operations:
await signIn.email({ email, password });
await fetchSession(); // ← Add this
await navigateTo('/dashboard');
```

**"Type errors after DB schema change"**

```bash
bun db:generate  # Regenerate types
bun typecheck    # Verify
```

**"Git hooks not running"**

```bash
bun prepare  # Install simple-git-hooks
```

**"Tests failing with Prisma errors"**

```typescript
// Mock Prisma modules (see apps/web/server/utils/db.test.ts):
vi.mock('@prisma/client');
vi.mock('@prisma/adapter-pg');
vi.mock('pg');
```

**"Build fails in CI but works locally"**

```bash
# Run full CI sequence locally:
bun lint
bun db:generate  # ← Often forgotten
bun typecheck
bun test:run
bun build
```

**"Bun command not found in scripts"**

```bash
# Use from repo root, not subdirectories:
cd /home/alois/bistro  # ← Go to root
bun dev                # ← Then run command
```

## Performance Targets

**Build:**

- Dev server start: < 2s
- Hot reload: < 200ms
- Production build: < 60s

**Runtime:**

- Initial page load: < 1s
- Route transitions: < 100ms
- API response: < 200ms

**Database:**

- Use connection pooling (pg.Pool)
- Index foreign keys (already in schema)
- Limit query results (pagination)

**CI:**

- Full pipeline: < 5 min
- Individual jobs: < 2 min each
- Use concurrency for parallel checks

## Architecture

### apps/web Structure

```
apps/web/
├── CLAUDE.md                # Web app overview
├── app/
│   ├── CLAUDE.md            # App context (pages, components, composables)
│   ├── app.vue              # Root (UApp wrapper, header/footer)
│   ├── pages/               # File-based routes
│   ├── components/          # Vue components (auto-imported)
│   ├── composables/         # useAuth.ts
│   ├── middleware/          # auth.global.ts (route protection)
│   └── assets/              # Static files
├── server/
│   ├── CLAUDE.md            # Server context (API, auth, DB)
│   ├── features/            # Domain features (auth, user, project, email)
│   ├── api/                 # API routes
│   └── utils/               # Core utilities (db, api-handler)
├── lib/                     # auth-client.ts (Better Auth client)
├── prisma/
│   ├── schema.prisma        # Database schema
│   ├── migrations/          # Migration history
│   └── generated/           # Prisma Client (gitignored)
├── nuxt.config.ts
├── vitest.config.ts
└── eslint.config.mjs
```

See context-specific CLAUDE.md files for detailed guidance.

### Database (Prisma 7 + PostgreSQL)

**Schema models:**

- `User` - Email, password, OAuth accounts, role (USER/ADMIN/SUPER_ADMIN)
- `Account` - OAuth provider links
- `Session` - Auth sessions (token, expiry, user agent)
- `ImpersonationLog` - Admin impersonation audit trail (admin, target, timestamps, reason)

**Import:** Use `server/utils/db.ts` singleton (Prisma Client with dev logging + @prisma/adapter-pg)

## Context-Specific Documentation

For detailed guidance on specific areas:

- **[apps/web/CLAUDE.md](./apps/web/CLAUDE.md)** - Web app overview, config, deployment
- **[apps/web/server/CLAUDE.md](./apps/web/server/CLAUDE.md)** - API routes, auth, DB patterns
- **[apps/web/app/CLAUDE.md](./apps/web/app/CLAUDE.md)** - Pages, components, composables

These files provide deep-dive context when working in specific areas. Root CLAUDE.md covers project-wide concerns.

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

## Roles & Permissions

**Role-Based Access Control (RBAC):**

- **Roles**: USER (default), ADMIN, SUPER_ADMIN
- **Database**: User.role field (Prisma enum)
- **Server**: `requireRole(['ADMIN', 'SUPER_ADMIN'])` middleware
- **Client**: `useRole()` composable (hasRole, isSuperAdmin, isAdmin)

**Admin Features:**

- **Impersonation**: SUPER_ADMIN can impersonate users (Better Auth admin plugin)
  - 1-hour auto-expiration
  - Audit logging (ImpersonationLog table)
  - Cannot impersonate other SUPER_ADMINs
  - Global banner shown during impersonation
- **User Management**: `/admin/users` - list users, change roles, impersonate
- **Admin Panel**: Access via AuthButton dropdown (SUPER_ADMIN only)

**First Super Admin Setup:**

```bash
bun db:studio
# In Prisma Studio: Update a user's role to SUPER_ADMIN
```

**Admin API Endpoints:**

- `GET /api/admin/users` - List all users (ADMIN+)
- `PUT /api/admin/users/:id/role` - Update user role (SUPER_ADMIN)
- `POST /api/admin/impersonate` - Start impersonation (SUPER_ADMIN)
- `POST /api/admin/impersonate/stop` - Stop impersonation (SUPER_ADMIN)
- `GET /api/admin/impersonate/active` - Check active session (SUPER_ADMIN)

## Payments & Email

**Polar Integration (Placeholder):**

- Webhook endpoint pattern: `/api/webhooks/polar`
- Verify webhook signature with POLAR_WEBHOOK_SECRET
- Handle events: checkout.completed, subscription.created, subscription.updated
- Update user subscription status in DB
- Test with Polar CLI webhook forwarding

**Resend Integration (Placeholder):**

- Use server-only import: `import { Resend } from 'resend'`
- Email templates in `server/emails/` as React components
- Common emails: welcome, password-reset, receipt
- Use server API routes, never client-side
- Test with Resend test API key

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
- ✅ Roles & Permissions (USER/ADMIN/SUPER_ADMIN)
- ✅ Admin impersonation (Better Auth admin plugin)
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

We keep all important docs in .agent folder and keep updating them, with the following file/folder structure:

.agent

    Tasks: PRD & implementation plan for each feature
    System: Document the current state of the system (project structure, tech stack, integration points, database schema, and core functionalities such as agent architecture, LLM layer, etc.)
    SOP: Best practices of execute certain tasks (e.g. how to add a schema migration, how to add a new page route, etc.)
    README.md: an index of all the documentations we have so people know what & where to look for things

We should always update .agent docs after we implement certain feature, to make sure it fully reflect the up to date information

Before you plan any implementation, always read the .agent/README first to get context
