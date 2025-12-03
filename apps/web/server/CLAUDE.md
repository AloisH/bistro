# Server Context (apps/web/server/)

Server-side Nuxt code - API routes, auth, DB utilities.

## Structure

```
server/
├── api/
│   └── auth/[...].ts    # Better Auth catch-all route
└── utils/
    ├── auth.ts          # Better Auth server config
    ├── serverAuth.ts    # Session helper
    └── db.ts            # Prisma singleton
```

## Database (Prisma 7)

**Always use singleton:**
```typescript
import { db } from '~/server/utils/db'

// ✅ Correct
const users = await db.user.findMany()

// ❌ Wrong - creates new connection
const prisma = new PrismaClient()
```

**Why PrismaPg adapter?**
- Prisma 7 requires driver adapters for better performance
- pg.Pool manages connections efficiently
- Global singleton prevents connection pool exhaustion

**Pattern:**
```typescript
// db.ts
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: pg.Pool | undefined
}

const pool = globalForPrisma.pool ?? new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
export const db = globalForPrisma.prisma ?? new PrismaClient({ adapter })
```

## Authentication (Better Auth)

**Server Setup (server/utils/auth.ts):**
- Conditional OAuth providers (only if env vars present)
- Prisma adapter for DB integration
- Session cookie cache (5 min)
- Trusted origins for CORS

**Conditional OAuth pattern:**
```typescript
const socialProviders: Record<string, Config> = {}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  }
}

export const auth = betterAuth({
  socialProviders,  // Empty object if no env vars
})
```

**Helper (server/utils/serverAuth.ts):**
```typescript
import { serverAuth } from '~/server/utils/serverAuth'

export default defineEventHandler(async (event) => {
  const session = await serverAuth().getSession({ headers: event.headers })
  if (!session) throw createError({ statusCode: 401 })
  return { userId: session.user.id }
})
```

## API Routes

**Naming convention:**
- `user.get.ts` - GET /api/user
- `user.post.ts` - POST /api/user
- `user/[id].get.ts` - GET /api/user/:id
- `[...].ts` - Catch-all (used for Better Auth)

**Pattern:**
```typescript
export default defineEventHandler(async (event) => {
  const session = await serverAuth().getSession({ headers: event.headers })
  const body = await readBody(event)
  const result = await db.model.create({ data: body })
  return result
})
```

## Common Patterns

**Protected endpoint:**
```typescript
const session = await serverAuth().getSession({ headers: event.headers })
if (!session?.user) {
  throw createError({ statusCode: 401, message: 'Unauthorized' })
}
const userId = session.user.id
```

**Transaction:**
```typescript
await db.$transaction(async (tx) => {
  const user = await tx.user.create({ data: userData })
  const project = await tx.project.create({ data: { userId: user.id } })
  return { user, project }
})
```

**Query with relations:**
```typescript
const projects = await db.project.findMany({
  where: { userId },
  include: { aiJobs: true },
  orderBy: { createdAt: 'desc' },
})
```

## Testing Server Code

**Mock Prisma:**
```typescript
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(function () {
    return { $connect: vi.fn(), $disconnect: vi.fn() }
  }),
}))

vi.mock('@prisma/adapter-pg', () => ({
  PrismaPg: vi.fn(function () {
    return { provider: 'postgres' }
  }),
}))

vi.mock('pg', () => ({
  default: { Pool: vi.fn(function () {
    return { connect: vi.fn(), end: vi.fn() }
  }) },
}))
```
