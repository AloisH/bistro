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

Bistro - Production-ready Nuxt 4 SaaS boilerplate with authentication, multi-tenancy, RBAC, and testing. Todo app included as example feature.

**Stack:**

- Nuxt 4 + Nuxt UI v4 + Tailwind 4
- PostgreSQL + Prisma 7 (with @prisma/adapter-pg)
- Better Auth (email/password + OAuth providers)
- Docker Compose (dev + prod)
- Vitest + Testing Library

**Core Features:**

- Todo example (CRUD with filtering/sorting)
- Multi-tenant organizations
- Role-based access control
- 5-step user onboarding
- Admin impersonation

## Monorepo Structure

Bun workspaces:

- `apps/web/` - Main Nuxt 4 app (implemented)
- `apps/landing/` - Marketing site (placeholder)
- `packages/cli/` - CLI tool (placeholder)

Only `apps/web` has implementation. Other workspaces are empty directories.

**CRITICAL - Shared Code Location:**

- ✅ Schemas go in `apps/web/shared/schemas/` (inside web app, next to server/ folder)
- ❌ NOT in monorepo root `/home/alois/bistro/shared/` (doesn't exist)
- Import via `#shared/schemas/user` or `#shared/schemas/organization` alias (configured in nuxt.config.ts)
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

- Components: PascalCase with feature prefix (`AuthButton.vue`, `ProfileForm.vue`)
  - Pattern: `FeatureName*` matching folder (auth/ → Auth*, profile/ → Profile*)
  - Shared utilities can omit prefix (`AppLogo.vue` in shared/)
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
- Must use PrismaPg adapter (Prisma 7 requirement) - handles connection pool internally
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
await navigateTo('/org/[slug]/dashboard');
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

- Use singleton db (PrismaPg handles pooling internally)
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

- `Todo` - id, title, description, completed, userId (user-scoped)
- `User` - Email, password, OAuth accounts, role (USER/ADMIN/SUPER_ADMIN)
- `Account` - OAuth provider links
- `Session` - Auth sessions (token, expiry, user agent)
- `ImpersonationLog` - Admin impersonation audit trail (admin, target, timestamps, reason)
- `Organization` - Name, slug, planType
- `OrganizationMember` - User-org link, role (OWNER/ADMIN/MEMBER/GUEST)
- `OrganizationInvite` - Email invites, token, expiry

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

## Test Infrastructure

Transaction-per-test pattern with fixture factories for integration tests.

### Quick Start Template

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { startTransaction, rollbackTransaction, db } from './testDb';
import { createTestUser, createTestOrg, createTestTodo } from './testFixtures';

describe('Feature Name', () => {
  beforeEach(async () => {
    await startTransaction();
  });

  afterEach(async () => {
    await rollbackTransaction();
  });

  it('describes specific behavior', async () => {
    // Arrange: Create test data
    const user = await createTestUser();

    // Act: Execute behavior under test
    const result = await yourService.method(user.id);

    // Assert: Verify outcome
    expect(result.id).toBeDefined();
    expect(result.userId).toBe(user.id);
  });
});
```

### Import Structure

**For server tests (features/, utils/, api/):**

```typescript
// Test framework
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// Test infrastructure (relative imports)
import { startTransaction, rollbackTransaction, db } from '../../utils/testDb';
import { createTestUser, createTestOrg, createTestTodo } from '../../utils/testFixtures';

// Module under test (relative import)
import { todoRepository } from './todo-repository';
```

**Key points:**

- Use relative imports for server-side test files
- `testDb` exports: `startTransaction`, `rollbackTransaction`, `db`
- `testFixtures` exports: `createTestUser`, `createTestOrg`, `createTestTodo`
- Adjust `../` depth based on file location

### Transaction Lifecycle

**Every integration test MUST use transaction hooks:**

```typescript
describe('Your Feature', () => {
  beforeEach(async () => {
    await startTransaction();
  });

  afterEach(async () => {
    await rollbackTransaction();
  });

  // Tests here automatically roll back
});
```

**Why transactions:**

- Complete isolation between tests
- Automatic cleanup (no manual teardown)
- Tests can run in any order
- No test pollution

### Fixture Factories

**Basic usage:**

```typescript
// Create with defaults
const user = await createTestUser();
const org = await createTestOrg();
const todo = await createTestTodo(user.id);
```

**Override defaults:**

```typescript
// User overrides
const admin = await createTestUser({
  role: 'ADMIN',
  email: 'admin@test.com',
  name: 'Admin User',
  emailVerified: true,
});

// Organization overrides
const premiumOrg = await createTestOrg({
  planType: 'premium',
  name: 'Premium Organization',
});

// Todo overrides
const completedTodo = await createTestTodo(user.id, {
  title: 'Completed Task',
  description: 'This is done',
  completed: true,
});
```

**Building relationships:**

```typescript
// Create user, org, and link them
const user = await createTestUser();
const org = await createTestOrg();
// Create org member relationship (use actual Prisma if no fixture exists)
await db.organizationMember.create({
  data: {
    userId: user.id,
    organizationId: org.id,
    role: 'OWNER',
  },
});
```

**Always use returned IDs:**

```typescript
// ✅ CORRECT: Use actual generated IDs
const user = await createTestUser();
const todo = await createTestTodo(user.id);
expect(todo.userId).toBe(user.id);

// ❌ WRONG: Never hardcode IDs
const todo = await createTestTodo('user-123'); // Fails - user doesn't exist
```

### Repository Testing Pattern

**Complete example:**

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { startTransaction, rollbackTransaction } from '../../utils/testDb';
import { createTestUser, createTestTodo } from '../../utils/testFixtures';
import { todoRepository } from './todo-repository';

describe('TodoRepository', () => {
  beforeEach(async () => {
    await startTransaction();
  });

  afterEach(async () => {
    await rollbackTransaction();
  });

  describe('findByUserId', () => {
    it('returns todos for specific user', async () => {
      const user = await createTestUser();
      const todo1 = await createTestTodo(user.id, { title: 'Task 1' });
      const todo2 = await createTestTodo(user.id, { title: 'Task 2' });

      const result = await todoRepository.findByUserId(user.id);

      expect(result).toHaveLength(2);
      expect(result.map((t) => t.id)).toContain(todo1.id);
      expect(result.map((t) => t.id)).toContain(todo2.id);
    });

    it('does not return other users todos', async () => {
      const user1 = await createTestUser();
      const user2 = await createTestUser();
      await createTestTodo(user1.id);
      await createTestTodo(user2.id);

      const result = await todoRepository.findByUserId(user1.id);

      expect(result).toHaveLength(1);
      expect(result[0].userId).toBe(user1.id);
    });
  });

  describe('create', () => {
    it('creates todo with required fields', async () => {
      const user = await createTestUser();

      const result = await todoRepository.create(user.id, {
        title: 'New task',
        description: 'Details here',
      });

      expect(result.id).toBeDefined();
      expect(result.title).toBe('New task');
      expect(result.userId).toBe(user.id);
    });
  });
});
```

### Common Patterns

**Testing CRUD operations:**

```typescript
// CREATE
it('creates entity', async () => {
  const user = await createTestUser();
  const entity = await repository.create(user.id, data);
  expect(entity.id).toBeDefined();
});

// READ
it('finds entity by id', async () => {
  const user = await createTestUser();
  const entity = await createEntity(user.id);
  const found = await repository.findById(entity.id, user.id);
  expect(found?.id).toBe(entity.id);
});

// UPDATE
it('updates entity', async () => {
  const user = await createTestUser();
  const entity = await createEntity(user.id);
  const updated = await repository.update(entity.id, user.id, { title: 'New' });
  expect(updated.title).toBe('New');
});

// DELETE
it('deletes entity', async () => {
  const user = await createTestUser();
  const entity = await createEntity(user.id);
  await repository.delete(entity.id);
  const found = await repository.findById(entity.id, user.id);
  expect(found).toBeNull();
});
```

**Testing user isolation (CRITICAL):**

```typescript
it('enforces user data isolation', async () => {
  const user1 = await createTestUser();
  const user2 = await createTestUser();
  const user1Entity = await createEntity(user1.id);

  // user2 should NOT see user1's entity
  const result = await repository.findById(user1Entity.id, user2.id);
  expect(result).toBeNull();
});
```

**Testing with filters:**

```typescript
it('filters by status', async () => {
  const user = await createTestUser();
  await createTestTodo(user.id, { completed: false });
  await createTestTodo(user.id, { completed: true });

  const active = await todoRepository.findByUserId(user.id, { filter: 'active' });
  const completed = await todoRepository.findByUserId(user.id, { filter: 'completed' });

  expect(active).toHaveLength(1);
  expect(completed).toHaveLength(1);
  expect(active[0].completed).toBe(false);
  expect(completed[0].completed).toBe(true);
});
```

**Testing error cases:**

```typescript
it('throws error when entity not found', async () => {
  const user = await createTestUser();

  await expect(service.getEntity('nonexistent-id', user.id)).rejects.toThrow();
});

it('returns null for missing entities', async () => {
  const user = await createTestUser();
  const result = await repository.findById('nonexistent-id', user.id);
  expect(result).toBeNull();
});
```

### Running Tests

```bash
# Single file
bun test apps/web/server/features/todo/todo-repository.test.ts

# With database
DATABASE_URL="postgresql://bistro:bistro@localhost:5432/bistro" bun test

# Watch mode
bun test

# All tests
bun test:run

# With shuffle (verify order independence)
bun test --sequence.shuffle
```

### Troubleshooting

**"Cannot find module" errors:**

- Use relative imports (`./testDb`, not `~/server/utils/testDb`)
- Check import depth (`../../utils/testDb` vs `../utils/testDb`)

**"Unique constraint failed":**

- Fixtures use timestamp + random for uniqueness
- Ensure transaction hooks are in place (beforeEach/afterEach)

**Tests fail in specific order:**

- Not using transactions properly
- Data created in `beforeAll` persists (use `beforeEach` instead)

**Slow tests:**

- Target: <50ms per fixture, <1s per test file
- Check database connection (should use existing pool)

### Edge Cases and Gotchas

**Auto-increment IDs (CRITICAL):**

IDs don't reset on rollback - sequences advance even when transactions roll back.

```typescript
// ❌ DON'T: Hardcode IDs
const user = await db.user.findUnique({ where: { id: 'user-1' } });
expect(todo.userId).toBe('user-1'); // FRAGILE - IDs change between runs

// ✅ DO: Use returned objects
const user = await createTestUser();
const todo = await createTestTodo(user.id);
expect(todo.userId).toBe(user.id); // RELIABLE - always matches
```

**beforeAll vs beforeEach (CRITICAL):**

Data created in `beforeAll` commits BEFORE transaction hooks run - it persists across all tests.

```typescript
// ⚠️ WARNING: beforeAll data persists
let globalUser;

beforeAll(async () => {
  // Data here commits immediately - survives all tests
  globalUser = await createTestUser(); // PERSISTS - shared state risk
});

beforeEach(async () => {
  await startTransaction();
  // Data here rolls back after each test
  const testUser = await createTestUser(); // CLEANED UP ✓
});

// 🎯 PREFER: Create data in each test for isolation
it('uses test data', async () => {
  const user = await createTestUser(); // Clear, isolated, reliable
  // Test logic
});
```

**When to use each:**

- `beforeEach`: Test data (preferred - automatic cleanup)
- `beforeAll`: Expensive setup that doesn't change (rare - manual cleanup required)

**Async operations (CRITICAL):**

All database operations must be awaited - missing `await` causes race conditions.

```typescript
// ❌ DON'T: Fire-and-forget
createTestUser(); // NOT AWAITED - undefined behavior
const result = await service.getUsers(); // May or may not see user

// ✅ DO: Await all database operations
const user = await createTestUser();
const result = await service.getUsers(); // Guaranteed to see user
```

**Unique constraints:**

Fixtures use timestamp + random for automatic uniqueness. Override when specific values needed.

```typescript
// ❌ DON'T: Duplicate unique values
const user1 = await createTestUser({ email: 'test@example.com' });
const user2 = await createTestUser({ email: 'test@example.com' }); // FAILS

// ✅ DO: Use fixture defaults (automatic uniqueness)
const user1 = await createTestUser(); // test-1234567890-abc123@example.com
const user2 = await createTestUser(); // test-1234567891-def456@example.com

// ✅ DO: Explicit unique values when testing specific emails
const user1 = await createTestUser({ email: 'user1@test.com' });
const user2 = await createTestUser({ email: 'user2@test.com' });
```

**Transaction lifecycle:**

Always pair `beforeEach` with `afterEach` - missing `afterEach` leaves transactions open.

```typescript
// ❌ DON'T: Missing afterEach
beforeEach(async () => await startTransaction());
// Tests run but never roll back - data leaks between tests

// ✅ DO: Always pair hooks
beforeEach(async () => await startTransaction());
afterEach(async () => await rollbackTransaction());
```

**Nested transactions:**

Not supported in current implementation - one transaction per test.

```typescript
// ❌ DON'T: Attempt nesting
await startTransaction();
await startTransaction(); // NOT SUPPORTED - undefined behavior
await rollbackTransaction();

// ✅ DO: One transaction per test (automatic with hooks)
beforeEach(async () => await startTransaction());
afterEach(async () => await rollbackTransaction());
// Each test gets clean transaction automatically
```

**Relationship handling:**

Foreign keys require parent entities to exist first.

```typescript
// ❌ DON'T: Create child before parent
const todo = await createTestTodo('nonexistent-user-id'); // FAILS

// ✅ DO: Create parent first, use returned ID
const user = await createTestUser();
const todo = await createTestTodo(user.id);
```

**Parallel test execution:**

Transactions isolate tests - safe to run in parallel within same file.

```typescript
// ✅ Safe: Each test has own transaction
it('test 1', async () => {
  const user = await createTestUser(); // Isolated
});

it('test 2', async () => {
  const user = await createTestUser(); // Different transaction
});
```

**Django ORM learnings applied:**

This pattern inspired by Django's `TransactionTestCase`:

- Transaction-per-test for isolation
- Auto-increment doesn't reset (use returned objects)
- `beforeAll` equivalent to Django `setUpTestData` (persists)
- `beforeEach` equivalent to Django `setUp` (per-test)

## Authentication

Better Auth (email/password implemented, OAuth planned):

- **Server**: `server/utils/auth.ts` (Better Auth + Prisma adapter), `server/utils/serverAuth.ts` (session helper)
- **Client**: `lib/auth-client.ts` (Better Auth client), `app/composables/useAuth.ts` (session state)
- **Routes**: `/auth/login`, `/auth/register`, `/org/[slug]/dashboard` (org-scoped)
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

## Multi-Tenancy

Organizations with role-based access. Session tracks currentOrganizationId.

**Models:**

- Organization - Name, slug, planType
- OrganizationMember - Links users to orgs with roles
- OrganizationInvite - Token-based email invites (7-day expiry)

**Roles:** OWNER > ADMIN > MEMBER > GUEST

**Server:** requireOrgAccess middleware, service layer permission checks
**Client:** Session-based org context, /org/[slug]/\* routes
**Switching:** OrganizationSwitcher component, PUT /api/user/current-organization

See apps/web/server/CLAUDE.md and apps/web/app/CLAUDE.md for patterns.

## Example Feature: Todo

**Implementation (use as template for your features):**

- **Backend:** `server/features/todo/` (service + repository pattern)
- **API:** `/api/todos` (GET list, POST create), `/api/todos/:id` (GET/PUT/DELETE), `/api/todos/:id/toggle` (POST)
- **Schemas:** `shared/schemas/todo.ts` (Zod validation)
- **Frontend:** `components/TodoList.vue`, `components/CreateTodoForm.vue`, `composables/useTodos.ts`
- **Page:** `/org/[slug]/dashboard` displays todo list

**Demonstrates patterns:**

- Full CRUD operations
- User-scoped queries (filtered by userId)
- Filter/sort with URL persistence
- Optimistic UI updates
- Service + repository architecture
- Type-safe validation (Zod → Prisma)

**To add your feature:** Copy todo structure, replace domain model, keep patterns.

## Project Status

**Implemented:**

- ✅ Todo management (CRUD, filter, sort, URL persistence)
- ✅ Nuxt 4 app structure
- ✅ Database (Prisma 7 + PostgreSQL)
- ✅ Auth (Better Auth email/password + OAuth)
- ✅ Multi-tenancy (Organizations + invites)
- ✅ Roles & Permissions (USER/ADMIN/SUPER_ADMIN)
- ✅ Admin impersonation (Better Auth admin plugin)
- ✅ 5-step onboarding flow
- ✅ Testing (Vitest + coverage)
- ✅ CI/CD (GitHub Actions)
- ✅ Docker (dev + prod)
- ✅ Git hooks (lint-staged)

**Scope:**

SaaS boilerplate with production patterns. Todo is example feature - replace with your domain model, keep the architecture.

We keep all important docs in .agent folder and keep updating them, with the following file/folder structure:

.agent

    Tasks: PRD & implementation plan for each feature
    System: Document the current state of the system (project structure, tech stack, integration points, database schema, and core functionalities such as agent architecture, LLM layer, etc.)
    SOP: Best practices of execute certain tasks (e.g. how to add a schema migration, how to add a new page route, etc.)
    README.md: an index of all the documentations we have so people know what & where to look for things

We should always update .agent docs after we implement certain feature, to make sure it fully reflect the up to date information

Before you plan any implementation, always read the .agent/README first to get context
