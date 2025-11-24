# Bistro — Detailed Implementation Plan

> **Purpose:** Step-by-step implementation guide with exact commands, file paths, and verification steps. Follow this sequentially to build Bistro from scratch.

---

## Implementation Phases Overview

```
Phase 0: Repository & Environment Setup (Day 1)
Phase 1: Monorepo Foundation (Day 1-2)
Phase 2: Core Packages (Day 2-3)
Phase 3: Starter Kit App (apps/web) (Day 3-7)
Phase 4: Landing Page (apps/landing) (Day 7-9)
Phase 5: Documentation Site (apps/docs) (Day 9-11)
Phase 6: CLI Tool (packages/cli) (Day 11-14)
Phase 7: IDE & Developer Experience (Day 14-15)
Phase 8: CI/CD & Automation (Day 15-16)
Phase 9: Example Apps & Templates (Day 16-21)
Phase 10: Testing & Quality (Day 21-25)
Phase 11: Documentation & Guides (Day 25-28)
Phase 12: Polish & Launch Prep (Day 28-30)
```

---

## Phase 0: Repository & Environment Setup

### Prerequisites
- Bun installed (`curl -fsSL https://bun.sh/install | bash`)
- Docker & Docker Compose installed
- Git configured
- GitHub account (for repository)

### Step 0.1: Initialize Repository

```bash
# Create project directory
mkdir bistro
cd bistro

# Initialize git
git init
git branch -M main

# Create initial README
cat > README.md << 'EOF'
# Bistro

Free, open-source Nuxt 4 starter kit for AI-powered SaaS products.

## Tech Stack
- Nuxt 4 + Nitro
- Nuxt UI + Tailwind 4
- PostgreSQL + Prisma
- Better Auth
- Vercel AI SDK
- Bun

## License
MIT
EOF

# Initial commit
git add README.md
git commit -m "Initial commit"
```

### Step 0.2: Create Base Directory Structure

```bash
# Create app directories
mkdir -p apps/web
mkdir -p apps/landing
mkdir -p apps/docs

# Create package directories
mkdir -p packages/cli
mkdir -p packages/ui
mkdir -p packages/lib
mkdir -p packages/database
mkdir -p packages/config

# Create support directories
mkdir -p templates
mkdir -p prompts
mkdir -p scripts
mkdir -p .vscode
mkdir -p .zed
mkdir -p .devcontainer
mkdir -p .claude
mkdir -p .github/workflows
mkdir -p .github/ISSUE_TEMPLATE
```

### Step 0.3: Create Root Package.json

```bash
cat > package.json << 'EOF'
{
  "name": "bistro",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "bun run --filter \"./apps/*\" dev",
    "dev:web": "bun run --filter web dev",
    "dev:landing": "bun run --filter landing dev",
    "dev:docs": "bun run --filter docs dev",
    "build": "bun run --filter \"./apps/*\" build",
    "build:web": "bun run --filter web build",
    "lint": "eslint .",
    "format": "prettier --write \"**/*.{ts,tsx,vue,js,jsx,json,md}\"",
    "typecheck": "bun run --filter \"./apps/*\" typecheck",
    "test": "vitest",
    "test:e2e": "playwright test",
    "db:migrate": "cd packages/database && bunx prisma migrate dev",
    "db:studio": "cd packages/database && bunx prisma studio",
    "db:generate": "cd packages/database && bunx prisma generate",
    "clean": "rm -rf node_modules apps/*/node_modules packages/*/node_modules apps/*/.nuxt apps/*/dist"
  },
  "devDependencies": {
    "@playwright/test": "^1.42.0",
    "@types/node": "^20.11.0",
    "eslint": "^8.56.0",
    "prettier": "^3.2.4",
    "typescript": "^5.3.3",
    "vitest": "^1.2.0"
  },
  "engines": {
    "node": ">=20.0.0",
    "bun": ">=1.0.0"
  }
}
EOF
```

### Step 0.4: Create Root Configuration Files

#### .gitignore
```bash
cat > .gitignore << 'EOF'
# Dependencies
node_modules
.pnp
.pnp.js

# Testing
coverage
.nyc_output

# Next.js / Nuxt
.next
.nuxt
dist
.output
.vercel

# Environment
.env
.env*.local

# IDEs
.idea
*.swp
*.swo
*~
.vscode/settings.json
.DS_Store

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# OS
Thumbs.db

# Prisma
*.db
*.db-journal

# Misc
.turbo
*.tsbuildinfo
.cache
EOF
```

#### .editorconfig
```bash
cat > .editorconfig << 'EOF'
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
EOF
```

### Step 0.5: Install Dependencies

```bash
bun install
```

**Verification:**
- `ls -la` shows all directories created
- `bun --version` works
- `git status` shows tracked files

---

## Phase 1: Monorepo Foundation

### Step 1.1: Setup Shared Config Package

```bash
cd packages/config
```

#### Create package.json
```bash
cat > package.json << 'EOF'
{
  "name": "@bistro/config",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "exports": {
    "./eslint": "./eslint.config.js",
    "./typescript": "./tsconfig.json"
  },
  "devDependencies": {
    "@nuxt/eslint-config": "^0.3.0",
    "@typescript-eslint/eslint-plugin": "^6.19.0",
    "@typescript-eslint/parser": "^6.19.0",
    "eslint": "^8.56.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-vue": "^9.20.1",
    "prettier": "^3.2.4",
    "typescript": "^5.3.3"
  }
}
EOF
```

#### Create eslint.config.js
```bash
cat > eslint.config.js << 'EOF'
import nuxt from '@nuxt/eslint-config'

export default nuxt({
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
})
EOF
```

#### Create tsconfig.json
```bash
cat > tsconfig.json << 'EOF'
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "allowJs": true,
    "types": ["node"]
  }
}
EOF
```

#### Create prettier.config.js
```bash
cat > prettier.config.js << 'EOF'
export default {
  semi: false,
  singleQuote: true,
  printWidth: 100,
  tabWidth: 2,
  trailingComma: 'es5',
  arrowParens: 'avoid',
  plugins: [],
}
EOF
```

```bash
cd ../..
```

### Step 1.2: Setup Shared Lib Package

```bash
cd packages/lib
```

#### Create package.json
```bash
cat > package.json << 'EOF'
{
  "name": "@bistro/lib",
  "version": "0.1.0",
  "type": "module",
  "exports": {
    "./types": "./src/types/index.ts",
    "./utils": "./src/utils/index.ts",
    "./constants": "./src/constants/index.ts"
  },
  "scripts": {
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@bistro/config": "workspace:*",
    "typescript": "^5.3.3"
  }
}
EOF
```

#### Create directory structure
```bash
mkdir -p src/types
mkdir -p src/utils
mkdir -p src/constants
```

#### Create src/types/index.ts
```bash
cat > src/types/index.ts << 'EOF'
import { z } from 'zod'

// User types
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type User = z.infer<typeof UserSchema>

// Organization types
export const OrganizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  ownerId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Organization = z.infer<typeof OrganizationSchema>

// Project types
export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  organizationId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Project = z.infer<typeof ProjectSchema>

// AI types
export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AIStreamResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    delta: {
      content?: string
    }
    finish_reason: string | null
  }>
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
}
EOF
```

#### Create src/utils/index.ts
```bash
cat > src/utils/index.ts << 'EOF'
/**
 * Generate a random ID
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Sleep for a given number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Format date to ISO string
 */
export function formatDate(date: Date): string {
  return date.toISOString()
}

/**
 * Slugify a string
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

/**
 * Truncate text to a given length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

/**
 * Check if running in browser
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

/**
 * Check if running in server
 */
export function isServer(): boolean {
  return !isBrowser()
}
EOF
```

#### Create src/constants/index.ts
```bash
cat > src/constants/index.ts << 'EOF'
export const APP_NAME = 'Bistro'
export const APP_DESCRIPTION = 'AI-powered SaaS starter kit'

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
} as const

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    SIGNUP: '/api/v1/auth/signup',
    LOGOUT: '/api/v1/auth/logout',
    ME: '/api/v1/auth/me',
  },
  PROJECTS: {
    LIST: '/api/v1/projects',
    CREATE: '/api/v1/projects',
    GET: (id: string) => `/api/v1/projects/${id}`,
    UPDATE: (id: string) => `/api/v1/projects/${id}`,
    DELETE: (id: string) => `/api/v1/projects/${id}`,
  },
  AI: {
    GENERATE: '/api/v1/ai/generate',
    STREAM: '/api/v1/ai/stream',
  },
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const
EOF
```

#### Create tsconfig.json
```bash
cat > tsconfig.json << 'EOF'
{
  "extends": "@bistro/config/typescript",
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF
```

```bash
cd ../..
```

### Step 1.3: Install Monorepo Dependencies

```bash
bun install
```

**Verification:**
- `bun run --filter @bistro/lib typecheck` passes
- All packages have `node_modules`

---

## Phase 2: Core Packages

### Step 2.1: Setup Database Package (Prisma)

```bash
cd packages/database
```

#### Create package.json
```bash
cat > package.json << 'EOF'
{
  "name": "@bistro/database",
  "version": "0.1.0",
  "type": "module",
  "exports": {
    ".": "./src/index.ts",
    "./client": "./src/client.ts"
  },
  "scripts": {
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:push": "prisma db push",
    "db:seed": "bun run src/seed.ts"
  },
  "dependencies": {
    "@prisma/client": "^5.9.0"
  },
  "devDependencies": {
    "prisma": "^5.9.0",
    "@bistro/config": "workspace:*",
    "typescript": "^5.3.3"
  }
}
EOF
```

#### Initialize Prisma
```bash
bunx prisma init
```

#### Create prisma/schema.prisma
```bash
cat > prisma/schema.prisma << 'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String?
  emailVerified DateTime?
  image     String?

  accounts  Account[]
  sessions  Session[]
  organizations OrganizationMember[]
  projects  Project[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model Organization {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?
  image       String?

  members     OrganizationMember[]
  projects    Project[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("organizations")
}

model OrganizationMember {
  id             String   @id @default(cuid())
  role           String   @default("member") // owner, admin, member
  userId         String
  organizationId String

  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, organizationId])
  @@map("organization_members")
}

model Project {
  id             String   @id @default(cuid())
  title          String
  description    String?
  slug           String
  status         String   @default("draft") // draft, published, archived

  userId         String
  organizationId String

  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  aiJobs         AIJob[]
  assets         Asset[]

  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@unique([organizationId, slug])
  @@map("projects")
}

model AIJob {
  id        String   @id @default(cuid())
  type      String   // text-generation, image-generation, etc.
  status    String   @default("pending") // pending, running, completed, failed
  input     Json
  output    Json?
  error     String?
  model     String
  tokens    Int?
  cost      Float?
  duration  Int?     // milliseconds

  projectId String
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("ai_jobs")
}

model Asset {
  id        String   @id @default(cuid())
  filename  String
  url       String
  mimeType  String
  size      Int

  projectId String
  project   Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("assets")
}

model PromptTemplate {
  id          String   @id @default(cuid())
  name        String
  description String?
  prompt      String
  variables   Json     // {name: string, description: string}[]
  category    String
  tags        String[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("prompt_templates")
}
EOF
```

#### Create src/client.ts
```bash
mkdir -p src

cat > src/client.ts << 'EOF'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

export default db
EOF
```

#### Create src/index.ts
```bash
cat > src/index.ts << 'EOF'
export * from '@prisma/client'
export { db } from './client'
export default db
EOF
```

#### Create src/seed.ts
```bash
cat > src/seed.ts << 'EOF'
import { db } from './client'

async function main() {
  console.log('Seeding database...')

  // Create a test user
  const user = await db.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
    },
  })

  // Create a test organization
  const org = await db.organization.upsert({
    where: { slug: 'test-org' },
    update: {},
    create: {
      name: 'Test Organization',
      slug: 'test-org',
      members: {
        create: {
          role: 'owner',
          userId: user.id,
        },
      },
    },
  })

  // Create prompt templates
  await db.promptTemplate.createMany({
    data: [
      {
        name: 'Blog Post Generator',
        description: 'Generate SEO-optimized blog posts',
        prompt: 'Write a comprehensive blog post about {{topic}}. Include an engaging introduction, {{sections}} main sections with detailed explanations, and a conclusion. Target audience: {{audience}}. Tone: {{tone}}.',
        variables: [
          { name: 'topic', description: 'The main topic of the blog post' },
          { name: 'sections', description: 'Number of main sections' },
          { name: 'audience', description: 'Target audience' },
          { name: 'tone', description: 'Writing tone (professional, casual, etc.)' },
        ],
        category: 'content',
        tags: ['blog', 'seo', 'content-writing'],
      },
      {
        name: 'Ad Copy Generator',
        description: 'Create compelling ad copy',
        prompt: 'Create {{count}} variations of ad copy for {{product}}. Platform: {{platform}}. Target audience: {{audience}}. Include a catchy headline, persuasive body text, and a strong call-to-action.',
        variables: [
          { name: 'count', description: 'Number of variations to generate' },
          { name: 'product', description: 'Product or service name' },
          { name: 'platform', description: 'Advertising platform (Google Ads, Facebook, etc.)' },
          { name: 'audience', description: 'Target audience description' },
        ],
        category: 'marketing',
        tags: ['advertising', 'copywriting', 'marketing'],
      },
    ],
    skipDuplicates: true,
  })

  console.log('Database seeded successfully!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
EOF
```

#### Create .env.example
```bash
cat > .env.example << 'EOF'
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bistro?schema=public"
EOF
```

```bash
cd ../..
```

### Step 2.2: Create Docker Compose for Local Development

```bash
cat > docker-compose.yml << 'EOF'
version: '3.9'

services:
  postgres:
    image: postgres:16-alpine
    container_name: bistro-postgres
    restart: unless-stopped
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: bistro
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: bistro-redis
    restart: unless-stopped
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
  redis_data:
EOF
```

### Step 2.3: Create Root .env File

```bash
cat > .env.example << 'EOF'
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bistro?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# Better Auth
AUTH_SECRET="change-me-to-a-random-32-char-string"
AUTH_URL="http://localhost:3000"

# AI Providers (optional - users bring their own keys)
OPENAI_API_KEY=""
ANTHROPIC_API_KEY=""

# Email (optional)
RESEND_API_KEY=""

# Payments (optional)
POLAR_ACCESS_TOKEN=""

# Storage (optional)
BLOB_READ_WRITE_TOKEN=""

# App
NODE_ENV="development"
EOF

cp .env.example .env
```

### Step 2.4: Install Database Dependencies & Initialize

```bash
# Install dependencies
cd packages/database
bun install
cd ../..

# Start Docker services
docker compose up -d

# Wait for services to be ready
sleep 5

# Generate Prisma client
cd packages/database
bunx prisma generate
bunx prisma migrate dev --name init
bunx prisma db seed
cd ../..
```

**Verification:**
- `docker ps` shows postgres & redis running
- `cd packages/database && bunx prisma studio` opens Prisma Studio
- Can see seeded data in database

---

## Phase 3: Starter Kit App (apps/web)

### Step 3.1: Initialize Nuxt 4 App

```bash
cd apps/web

# Create package.json
cat > package.json << 'EOF'
{
  "name": "web",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare",
    "typecheck": "nuxt typecheck",
    "lint": "eslint .",
    "format": "prettier --write ."
  },
  "dependencies": {
    "@bistro/database": "workspace:*",
    "@bistro/lib": "workspace:*",
    "@nuxt/ui": "^2.13.0",
    "@vercel/ai": "^3.0.0",
    "better-auth": "^0.1.0",
    "nuxt": "^3.10.0",
    "vue": "^3.4.15",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@bistro/config": "workspace:*",
    "@nuxt/devtools": "^1.0.8",
    "typescript": "^5.3.3"
  }
}
EOF

bun install
```

### Step 3.2: Create Nuxt Configuration

```bash
cat > nuxt.config.ts << 'EOF'
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ['@nuxt/ui'],

  runtimeConfig: {
    // Private keys (server-only)
    databaseUrl: process.env.DATABASE_URL,
    authSecret: process.env.AUTH_SECRET,
    openaiApiKey: process.env.OPENAI_API_KEY,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    resendApiKey: process.env.RESEND_API_KEY,

    // Public keys (client + server)
    public: {
      appName: 'Bistro',
      appUrl: process.env.AUTH_URL || 'http://localhost:3000',
    },
  },

  nitro: {
    experimental: {
      openAPI: true,
    },
  },

  typescript: {
    strict: true,
    typeCheck: true,
  },

  imports: {
    dirs: ['composables', 'utils', 'types'],
  },

  compatibilityDate: '2024-01-01',
})
EOF
```

### Step 3.3: Create Directory Structure

```bash
mkdir -p pages
mkdir -p components
mkdir -p composables
mkdir -p server/api/v1/auth
mkdir -p server/api/v1/projects
mkdir -p server/api/v1/ai
mkdir -p server/middleware
mkdir -p server/utils
mkdir -p utils
mkdir -p types
mkdir -p assets/css
mkdir -p public
```

### Step 3.4: Create Base Layout & Pages

#### app.vue
```bash
cat > app.vue << 'EOF'
<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
EOF
```

#### layouts/default.vue
```bash
mkdir -p layouts

cat > layouts/default.vue << 'EOF'
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <AppHeader />
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
EOF
```

#### pages/index.vue
```bash
cat > pages/index.vue << 'EOF'
<script setup lang="ts">
const title = 'Welcome to Bistro'
const description = 'AI-powered SaaS starter kit built with Nuxt 4'

useSeoMeta({
  title,
  description,
})
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-[70vh]">
    <h1 class="text-5xl font-bold mb-4">{{ title }}</h1>
    <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">{{ description }}</p>

    <div class="flex gap-4">
      <UButton to="/dashboard" size="lg">Get Started</UButton>
      <UButton to="/docs" variant="outline" size="lg">Documentation</UButton>
    </div>
  </div>
</template>
EOF
```

#### pages/dashboard/index.vue
```bash
mkdir -p pages/dashboard

cat > pages/dashboard/index.vue << 'EOF'
<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const title = 'Dashboard'
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-8">{{ title }}</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">Projects</h2>
        </template>
        <p class="text-3xl font-bold">0</p>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">AI Jobs</h2>
        </template>
        <p class="text-3xl font-bold">0</p>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">Assets</h2>
        </template>
        <p class="text-3xl font-bold">0</p>
      </UCard>
    </div>

    <UButton to="/dashboard/projects/new">Create Project</UButton>
  </div>
</template>
EOF
```

### Step 3.5: Create Components

#### components/AppHeader.vue
```bash
cat > components/AppHeader.vue << 'EOF'
<script setup lang="ts">
const config = useRuntimeConfig()
const appName = config.public.appName
</script>

<template>
  <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
    <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center">
          <NuxtLink to="/" class="text-xl font-bold">
            {{ appName }}
          </NuxtLink>
        </div>

        <div class="flex items-center gap-4">
          <UButton to="/dashboard" variant="ghost">Dashboard</UButton>
          <UButton to="/auth/login" variant="ghost">Login</UButton>
        </div>
      </div>
    </nav>
  </header>
</template>
EOF
```

#### components/AppFooter.vue
```bash
cat > components/AppFooter.vue << 'EOF'
<template>
  <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <p class="text-center text-gray-600 dark:text-gray-400">
        © {{ new Date().getFullYear() }} Bistro. Open source under MIT License.
      </p>
    </div>
  </footer>
</template>
EOF
```

### Step 3.6: Create API Routes

#### server/api/v1/health.get.ts
```bash
cat > server/api/v1/health.get.ts << 'EOF'
export default defineEventHandler(() => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
  }
})
EOF
```

#### server/middleware/error.ts
```bash
cat > server/middleware/error.ts << 'EOF'
export default defineEventHandler((event) => {
  // Global error handling can be added here
})
EOF
```

```bash
cd ../..
```

**Verification:**
- `bun run dev:web` starts the app
- Visit http://localhost:3000
- Home page loads with header/footer
- Dashboard page accessible

---

## Phase 4: Landing Page (apps/landing)

### Step 4.1: Initialize Landing Page App

```bash
cd apps/landing

cat > package.json << 'EOF'
{
  "name": "landing",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "nuxt dev --port 3001",
    "build": "nuxt build",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare"
  },
  "dependencies": {
    "@bistro/lib": "workspace:*",
    "@nuxt/content": "^2.12.0",
    "@nuxt/ui": "^2.13.0",
    "nuxt": "^3.10.0",
    "vue": "^3.4.15"
  },
  "devDependencies": {
    "@bistro/config": "workspace:*",
    "typescript": "^5.3.3"
  }
}
EOF

bun install
```

### Step 4.2: Configure Landing Page

```bash
cat > nuxt.config.ts << 'EOF'
export default defineNuxtConfig({
  extends: [],
  modules: ['@nuxt/ui', '@nuxt/content'],

  content: {
    highlight: {
      theme: 'github-dark',
    },
  },

  runtimeConfig: {
    public: {
      appName: 'Bistro',
    },
  },

  compatibilityDate: '2024-01-01',
})
EOF
```

### Step 4.3: Create Landing Page Structure

```bash
mkdir -p pages
mkdir -p components/landing
mkdir -p content
mkdir -p public/images
```

#### app.vue
```bash
cat > app.vue << 'EOF'
<template>
  <div>
    <NuxtPage />
  </div>
</template>
EOF
```

#### pages/index.vue
```bash
cat > pages/index.vue << 'EOF'
<script setup lang="ts">
useSeoMeta({
  title: 'Bistro - Open Source Nuxt 4 SaaS Starter Kit',
  description:
    'Free, AI-powered SaaS starter kit. Built with Nuxt 4, Better Auth, Vercel AI SDK, and Prisma.',
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
    <LandingHeader />
    <LandingHero />
    <LandingFeatures />
    <LandingComparison />
    <LandingCta />
    <LandingFooter />
  </div>
</template>
EOF
```

### Step 4.4: Create Landing Components

#### components/landing/LandingHeader.vue
```bash
cat > components/landing/LandingHeader.vue << 'EOF'
<template>
  <header class="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b">
    <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center gap-8">
        <h1 class="text-xl font-bold">Bistro</h1>
        <div class="hidden md:flex gap-6">
          <NuxtLink to="#features" class="text-sm hover:text-primary">Features</NuxtLink>
          <NuxtLink to="#comparison" class="text-sm hover:text-primary">Comparison</NuxtLink>
          <NuxtLink to="/docs" class="text-sm hover:text-primary">Docs</NuxtLink>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <UButton
          to="https://github.com/bistro/bistro"
          target="_blank"
          variant="ghost"
          icon="i-simple-icons-github"
        >
          GitHub
        </UButton>
        <UButton to="/dashboard">Get Started</UButton>
      </div>
    </nav>
  </header>
</template>
EOF
```

#### components/landing/LandingHero.vue
```bash
cat > components/landing/LandingHero.vue << 'EOF'
<template>
  <section class="py-20 px-4 text-center">
    <div class="mx-auto max-w-4xl">
      <UBadge color="primary" variant="soft" class="mb-4">
        100% Free & Open Source
      </UBadge>
      <h1 class="text-5xl md:text-7xl font-bold mb-6">
        Build AI-Powered SaaS <br />
        <span class="text-primary">10x Faster</span>
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
        Production-ready Nuxt 4 starter kit with Better Auth, Vercel AI SDK, Prisma, and more.
        Skip the boring stuff and ship faster.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <UButton size="xl" to="/dashboard" class="font-semibold">
          Get Started Free
        </UButton>
        <UButton
          size="xl"
          variant="outline"
          to="https://github.com/bistro/bistro"
          target="_blank"
          icon="i-simple-icons-github"
        >
          View on GitHub
        </UButton>
      </div>
      <div class="mt-12 flex items-center justify-center gap-8 text-sm text-gray-600">
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-check-circle" class="text-green-500" />
          <span>MIT License</span>
        </div>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-check-circle" class="text-green-500" />
          <span>TypeScript</span>
        </div>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-check-circle" class="text-green-500" />
          <span>Docker Ready</span>
        </div>
      </div>
    </div>
  </section>
</template>
EOF
```

#### components/landing/LandingFeatures.vue
```bash
cat > components/landing/LandingFeatures.vue << 'EOF'
<script setup lang="ts">
const features = [
  {
    icon: 'i-heroicons-sparkles',
    title: 'AI-First',
    description: 'Built-in Vercel AI SDK integration with streaming, multi-provider support.',
  },
  {
    icon: 'i-heroicons-shield-check',
    title: 'Better Auth',
    description: 'Modern authentication with email, OAuth, magic links, and 2FA.',
  },
  {
    icon: 'i-heroicons-code-bracket',
    title: 'Nuxt 4 + TypeScript',
    description: 'Latest Nuxt with full TypeScript support and auto-imports.',
  },
  {
    icon: 'i-heroicons-paint-brush',
    title: 'Nuxt UI + Tailwind 4',
    description: 'Beautiful, accessible components built on Headless UI.',
  },
  {
    icon: 'i-heroicons-circle-stack',
    title: 'Prisma + PostgreSQL',
    description: 'Type-safe database queries with migrations and seeding.',
  },
  {
    icon: 'i-heroicons-command-line',
    title: 'Powerful CLI',
    description: 'Scaffold projects, add features, deploy with simple commands.',
  },
]
</script>

<template>
  <section id="features" class="py-20 px-4 bg-gray-50 dark:bg-gray-900">
    <div class="mx-auto max-w-7xl">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold mb-4">Everything You Need</h2>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          Production-ready features to build your SaaS
        </p>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <UCard v-for="feature in features" :key="feature.title">
          <template #header>
            <div class="flex items-center gap-3">
              <UIcon :name="feature.icon" class="text-2xl text-primary" />
              <h3 class="text-lg font-semibold">{{ feature.title }}</h3>
            </div>
          </template>
          <p class="text-gray-600 dark:text-gray-400">{{ feature.description }}</p>
        </UCard>
      </div>
    </div>
  </section>
</template>
EOF
```

#### components/landing/LandingComparison.vue
```bash
cat > components/landing/LandingComparison.vue << 'EOF'
<template>
  <section id="comparison" class="py-20 px-4">
    <div class="mx-auto max-w-7xl">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold mb-4">Why Bistro?</h2>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          Free alternative to paid Nuxt starter kits
        </p>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b">
              <th class="text-left p-4">Feature</th>
              <th class="text-center p-4 bg-primary/10">Bistro</th>
              <th class="text-center p-4">supastarter</th>
              <th class="text-center p-4">supersaas</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b">
              <td class="p-4 font-medium">Price</td>
              <td class="text-center p-4 bg-primary/5"><strong>Free</strong></td>
              <td class="text-center p-4">$349</td>
              <td class="text-center p-4">$149</td>
            </tr>
            <tr class="border-b">
              <td class="p-4 font-medium">Framework</td>
              <td class="text-center p-4 bg-primary/5">Nuxt 4</td>
              <td class="text-center p-4">Nuxt 3</td>
              <td class="text-center p-4">Nuxt 4</td>
            </tr>
            <tr class="border-b">
              <td class="p-4 font-medium">AI Features</td>
              <td class="text-center p-4 bg-primary/5">✓</td>
              <td class="text-center p-4">Basic</td>
              <td class="text-center p-4">✗</td>
            </tr>
            <tr class="border-b">
              <td class="p-4 font-medium">License</td>
              <td class="text-center p-4 bg-primary/5"><strong>MIT</strong></td>
              <td class="text-center p-4">Proprietary</td>
              <td class="text-center p-4">Proprietary</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
EOF
```

#### components/landing/LandingCta.vue
```bash
cat > components/landing/LandingCta.vue << 'EOF'
<template>
  <section class="py-20 px-4 bg-primary text-white">
    <div class="mx-auto max-w-4xl text-center">
      <h2 class="text-4xl font-bold mb-4">Ready to Build?</h2>
      <p class="text-xl mb-8 opacity-90">
        Get started in minutes with our CLI tool
      </p>
      <div class="bg-gray-900 rounded-lg p-6 mb-8 text-left">
        <code class="text-green-400">$ bun create bistro my-saas</code>
      </div>
      <UButton size="xl" color="white" to="/dashboard">
        Start Building Now
      </UButton>
    </div>
  </section>
</template>
EOF
```

#### components/landing/LandingFooter.vue
```bash
cat > components/landing/LandingFooter.vue << 'EOF'
<template>
  <footer class="py-12 px-4 border-t">
    <div class="mx-auto max-w-7xl">
      <div class="grid md:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 class="font-bold mb-4">Bistro</h3>
          <p class="text-sm text-gray-600">
            Open source Nuxt 4 SaaS starter kit
          </p>
        </div>
        <div>
          <h4 class="font-semibold mb-4">Product</h4>
          <ul class="space-y-2 text-sm">
            <li><NuxtLink to="/docs">Documentation</NuxtLink></li>
            <li><NuxtLink to="/examples">Examples</NuxtLink></li>
            <li><a href="https://github.com/bistro/bistro" target="_blank">GitHub</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold mb-4">Community</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#">Discord</a></li>
            <li><a href="#">Twitter</a></li>
            <li><a href="https://github.com/bistro/bistro/discussions" target="_blank">Discussions</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-semibold mb-4">Legal</h4>
          <ul class="space-y-2 text-sm">
            <li><NuxtLink to="/privacy">Privacy</NuxtLink></li>
            <li><NuxtLink to="/terms">Terms</NuxtLink></li>
            <li><a href="https://github.com/bistro/bistro/blob/main/LICENSE" target="_blank">License</a></li>
          </ul>
        </div>
      </div>
      <div class="text-center text-sm text-gray-600">
        © {{ new Date().getFullYear() }} Bistro. Open source under MIT License.
      </div>
    </div>
  </footer>
</template>
EOF
```

```bash
cd ../..
```

**Verification:**
- `bun run dev:landing` starts on port 3001
- Visit http://localhost:3001
- Landing page loads with all sections

---

## Phase 5: Documentation Site (apps/docs)

### Step 5.1: Initialize Docs App

```bash
cd apps/docs

cat > package.json << 'EOF'
{
  "name": "docs",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "nuxt dev --port 3002",
    "build": "nuxt build",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "postinstall": "nuxt prepare"
  },
  "dependencies": {
    "@nuxt/content": "^2.12.0",
    "@nuxt/ui-pro": "^1.0.0",
    "@nuxt/ui": "^2.13.0",
    "nuxt": "^3.10.0",
    "vue": "^3.4.15"
  },
  "devDependencies": {
    "@bistro/config": "workspace:*",
    "typescript": "^5.3.3"
  }
}
EOF

bun install
```

### Step 5.2: Configure Docs Site

```bash
cat > nuxt.config.ts << 'EOF'
export default defineNuxtConfig({
  extends: ['@nuxt/ui-pro'],
  modules: ['@nuxt/content', '@nuxt/ui'],

  content: {
    highlight: {
      theme: {
        default: 'github-light',
        dark: 'github-dark',
      },
      preload: ['json', 'js', 'ts', 'vue', 'bash', 'yaml', 'dockerfile'],
    },
    navigation: {
      fields: ['icon', 'titleTemplate'],
    },
  },

  compatibilityDate: '2024-01-01',
})
EOF
```

### Step 5.3: Create Content Structure

```bash
mkdir -p content/docs
mkdir -p content/docs/getting-started
mkdir -p content/docs/guides
mkdir -p content/docs/api

# Create navigation
cat > content/docs/_dir.yml << 'EOF'
title: Documentation
icon: i-heroicons-book-open
EOF
```

### Step 5.4: Create Documentation Pages

#### content/docs/index.md
```bash
cat > content/docs/index.md << 'EOF'
---
title: Introduction
description: Welcome to Bistro documentation
---

# Welcome to Bistro

Bistro is a free, open-source Nuxt 4 starter kit for building AI-powered SaaS applications.

## What's Included

- **Nuxt 4**: Latest full-stack framework
- **Better Auth**: Modern authentication
- **Vercel AI SDK**: AI integration with streaming
- **Prisma + PostgreSQL**: Type-safe database
- **Nuxt UI + Tailwind 4**: Beautiful components
- **Docker**: Production-ready containers

## Quick Start

```bash
bun create bistro my-saas
cd my-saas
bun install
docker compose up -d
bun dev
```

Your app will be running at [http://localhost:3000](http://localhost:3000)

## Next Steps

- [Installation](/docs/getting-started/installation)
- [Configuration](/docs/getting-started/configuration)
- [Deployment](/docs/guides/deployment)
EOF
```

#### content/docs/getting-started/installation.md
```bash
cat > content/docs/getting-started/installation.md << 'EOF'
---
title: Installation
description: Get Bistro running locally
---

# Installation

## Prerequisites

Ensure you have the following installed:

- [Bun](https://bun.sh) >= 1.0
- [Docker](https://docker.com) >= 20.0
- [Git](https://git-scm.com)

## Create a New Project

Use the Bistro CLI to create a new project:

```bash
bun create bistro my-saas
```

This will:
1. Clone the template
2. Install dependencies
3. Initialize git repository
4. Create `.env` file

## Start Development

```bash
cd my-saas

# Start database
docker compose up -d

# Run migrations
bun db:migrate

# Start dev server
bun dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
my-saas/
├── apps/
│   └── web/           # Main application
├── packages/
│   ├── database/      # Prisma schema
│   ├── lib/           # Shared utilities
│   └── ui/            # UI components
├── docker-compose.yml
└── package.json
```

## Next Steps

- [Configuration](/docs/getting-started/configuration)
- [Database Setup](/docs/getting-started/database)
EOF
```

```bash
cd ../..
```

**Verification:**
- `bun run dev:docs` starts on port 3002
- Visit http://localhost:3002
- Documentation pages render correctly

---

## Phase 6: CLI Tool (packages/cli)

### Step 6.1: Initialize CLI Package

```bash
cd packages/cli

cat > package.json << 'EOF'
{
  "name": "@bistro/cli",
  "version": "0.1.0",
  "type": "module",
  "bin": {
    "bistro": "./dist/index.js"
  },
  "scripts": {
    "build": "tsup src/index.ts --format esm --dts",
    "dev": "tsup src/index.ts --format esm --watch",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "commander": "^12.0.0",
    "prompts": "^2.4.2",
    "chalk": "^5.3.0",
    "ora": "^8.0.1",
    "execa": "^8.0.1",
    "fs-extra": "^11.2.0"
  },
  "devDependencies": {
    "@bistro/config": "workspace:*",
    "@types/fs-extra": "^11.0.4",
    "@types/prompts": "^2.4.9",
    "tsup": "^8.0.1",
    "typescript": "^5.3.3"
  }
}
EOF

bun install
```

### Step 6.2: Create CLI Structure

```bash
mkdir -p src/commands
mkdir -p src/utils
mkdir -p src/templates
```

#### src/index.ts
```bash
cat > src/index.ts << 'EOF'
#!/usr/bin/env node
import { Command } from 'commander'
import { create } from './commands/create.js'
import { add } from './commands/add.js'

const program = new Command()

program
  .name('bistro')
  .description('Bistro CLI - Build AI-powered SaaS apps')
  .version('0.1.0')

program
  .command('create')
  .argument('[name]', 'Project name')
  .option('-t, --template <template>', 'Template to use', 'saas-full')
  .description('Create a new Bistro project')
  .action(create)

program
  .command('add')
  .argument('<feature>', 'Feature to add (auth|ai|payments|email)')
  .description('Add a feature to your project')
  .action(add)

program.parse()
EOF
```

#### src/commands/create.ts
```bash
cat > src/commands/create.ts << 'EOF'
import prompts from 'prompts'
import chalk from 'chalk'
import ora from 'ora'
import { execa } from 'execa'
import fs from 'fs-extra'
import path from 'path'

export async function create(name?: string, options?: { template?: string }) {
  console.log(chalk.bold.cyan('\n🍽️  Bistro - Create your SaaS\n'))

  // Prompt for project name if not provided
  if (!name) {
    const response = await prompts({
      type: 'text',
      name: 'name',
      message: 'Project name:',
      initial: 'my-bistro-app',
    })
    name = response.name
  }

  if (!name) {
    console.log(chalk.red('Project name is required'))
    process.exit(1)
  }

  // Prompt for template
  const template =
    options?.template ||
    (
      await prompts({
        type: 'select',
        name: 'template',
        message: 'Choose a template:',
        choices: [
          { title: 'SaaS Full (recommended)', value: 'saas-full' },
          { title: 'SaaS Basic', value: 'saas-basic' },
          { title: 'Minimal', value: 'minimal' },
        ],
        initial: 0,
      })
    ).template

  const targetDir = path.resolve(process.cwd(), name)

  // Check if directory exists
  if (await fs.pathExists(targetDir)) {
    console.log(chalk.red(`Directory ${name} already exists`))
    process.exit(1)
  }

  const spinner = ora('Creating project...').start()

  try {
    // Clone template
    await execa('git', [
      'clone',
      '--depth',
      '1',
      'https://github.com/bistro/bistro',
      targetDir,
    ])

    // Remove .git
    await fs.remove(path.join(targetDir, '.git'))

    // Update package.json
    const pkgPath = path.join(targetDir, 'package.json')
    const pkg = await fs.readJson(pkgPath)
    pkg.name = name
    await fs.writeJson(pkgPath, pkg, { spaces: 2 })

    // Create .env
    await fs.copy(
      path.join(targetDir, '.env.example'),
      path.join(targetDir, '.env')
    )

    spinner.succeed('Project created!')

    // Install dependencies
    spinner.start('Installing dependencies...')
    await execa('bun', ['install'], { cwd: targetDir })
    spinner.succeed('Dependencies installed!')

    // Initialize git
    spinner.start('Initializing git...')
    await execa('git', ['init'], { cwd: targetDir })
    await execa('git', ['add', '.'], { cwd: targetDir })
    await execa('git', ['commit', '-m', 'Initial commit'], { cwd: targetDir })
    spinner.succeed('Git initialized!')

    console.log(chalk.green.bold('\n✓ Success!\n'))
    console.log('Next steps:')
    console.log(chalk.cyan(`  cd ${name}`))
    console.log(chalk.cyan('  docker compose up -d'))
    console.log(chalk.cyan('  bun db:migrate'))
    console.log(chalk.cyan('  bun dev\n'))
  } catch (error) {
    spinner.fail('Failed to create project')
    console.error(error)
    process.exit(1)
  }
}
EOF
```

#### src/commands/add.ts
```bash
cat > src/commands/add.ts << 'EOF'
import chalk from 'chalk'
import ora from 'ora'

export async function add(feature: string) {
  const spinner = ora(`Adding ${feature}...`).start()

  // Placeholder - implement feature addition
  await new Promise(resolve => setTimeout(resolve, 1000))

  spinner.succeed(`${feature} added!`)

  console.log(chalk.green('\nFeature installation guide:'))
  console.log('1. Configure environment variables in .env')
  console.log('2. Run migrations if needed')
  console.log('3. Restart dev server\n')
}
EOF
```

### Step 6.3: Build CLI

```bash
cat > tsconfig.json << 'EOF'
{
  "extends": "@bistro/config/typescript",
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler"
  },
  "include": ["src/**/*"]
}
EOF

bun run build
```

```bash
cd ../..
```

**Verification:**
- `cd packages/cli && bun run build`
- `./packages/cli/dist/index.js --help` shows CLI help

---

## Phase 7: IDE & Developer Experience

### Step 7.1: VSCode Configuration

```bash
# .vscode/settings.json
cat > .vscode/settings.json << 'EOF'
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
EOF
```

```bash
# .vscode/extensions.json
cat > .vscode/extensions.json << 'EOF'
{
  "recommendations": [
    "Vue.volar",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "Prisma.prisma",
    "usernamehw.errorlens",
    "eamodio.gitlens",
    "GitHub.copilot"
  ]
}
EOF
```

```bash
# .vscode/launch.json
cat > .vscode/launch.json << 'EOF'
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Nuxt",
      "runtimeExecutable": "bun",
      "runtimeArgs": ["run", "dev:web"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
EOF
```

### Step 7.2: Zed Configuration

```bash
mkdir -p .zed

cat > .zed/settings.json << 'EOF'
{
  "language_servers": ["typescript-language-server", "volar"],
  "format_on_save": "on",
  "formatter": "prettier",
  "tab_size": 2
}
EOF
```

### Step 7.3: Cursor AI Rules

```bash
cat > .cursorrules << 'EOF'
# Bistro Project Rules

## Tech Stack
- Framework: Nuxt 4 with Nitro server
- UI: Nuxt UI + Tailwind CSS 4
- Database: PostgreSQL + Prisma
- Auth: Better Auth
- AI: Vercel AI SDK

## Code Style
- Use TypeScript strict mode
- Use Composition API with <script setup>
- Prefer composables over mixins
- Use auto-imports (don't import ref, computed, etc.)
- Use Prisma for all database queries

## File Structure
- API routes: server/api/v1/[resource]/[action].ts
- Pages: pages/[resource]/[...slug].vue
- Components: components/[category]/[Component].vue
- Composables: composables/use[Feature].ts

## Naming Conventions
- Components: PascalCase (AppHeader.vue)
- Composables: camelCase with "use" prefix (useAuth.ts)
- API routes: kebab-case (user-profile.get.ts)
- Database models: PascalCase (User, Project)

## Best Practices
- Always validate input with Zod
- Use proper TypeScript types
- Add error handling to API routes
- Use transactions for multi-step DB operations
- Implement rate limiting for public endpoints
EOF
```

### Step 7.4: Claude Code Configuration

```bash
mkdir -p .claude

cat > .claude/CLAUDE.md << 'EOF'
# Claude Code Project Instructions

## Architecture
Monorepo with bun workspaces. Apps in `/apps`, shared packages in `/packages`.

## Development
- Run `bun dev` to start all apps
- Run `bun db:migrate` for database changes
- Run `bun test` before committing

## Common Tasks

### Add new API endpoint
1. Create file in `apps/web/server/api/v1/[resource]/`
2. Use `defineEventHandler`
3. Validate input with Zod
4. Return typed response

### Add new page
1. Create file in `apps/web/pages/`
2. Use `<script setup lang="ts">`
3. Add page meta if needed
4. Use Nuxt UI components

### Add database model
1. Update `packages/database/prisma/schema.prisma`
2. Run `bun db:migrate`
3. Update types in `packages/lib/src/types/`

## Code Patterns

### API Route
\`\`\`typescript
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  // Validate with Zod
  // Query database
  // Return response
})
\`\`\`

### Composable
\`\`\`typescript
export const useFeature = () => {
  const state = ref()
  const fetch = async () => {}
  return { state, fetch }
}
\`\`\`
EOF
```

### Step 7.5: DevContainer

```bash
cat > .devcontainer/devcontainer.json << 'EOF'
{
  "name": "Bistro Dev Container",
  "image": "mcr.microsoft.com/devcontainers/typescript-node:20",
  "features": {
    "ghcr.io/devcontainers/features/docker-in-docker:2": {},
    "ghcr.io/devcontainers/features/github-cli:1": {}
  },
  "postCreateCommand": "bun install && docker compose up -d && bun db:migrate",
  "customizations": {
    "vscode": {
      "extensions": [
        "Vue.volar",
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "Prisma.prisma"
      ]
    }
  },
  "forwardPorts": [3000, 5432, 6379],
  "remoteUser": "node"
}
EOF
```

### Step 7.6: Pre-commit Hooks

```bash
cat > package.json << 'EOF'
{
  "name": "bistro",
  "private": true,
  "scripts": {
    "prepare": "husky install"
  },
  "devDependencies": {
    "husky": "^9.0.0",
    "lint-staged": "^15.2.0"
  },
  "lint-staged": {
    "*.{js,ts,vue}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
EOF

bun install
bunx husky install
bunx husky add .husky/pre-commit "bunx lint-staged"
```

**Verification:**
- VSCode opens with recommended extensions
- `.cursorrules` visible in Cursor
- Husky hooks installed

---

## Phase 8: CI/CD & Automation

### Step 8.1: GitHub Actions - CI Workflow

```bash
mkdir -p .github/workflows

cat > .github/workflows/ci.yml << 'EOF'
name: CI

on:
  pull_request:
  push:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run typecheck

  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
EOF
```

### Step 8.2: E2E Testing Workflow

```bash
cat > .github/workflows/e2e.yml << 'EOF'
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - name: Install Playwright
        run: bunx playwright install --with-deps
      - name: Start services
        run: docker compose up -d
      - name: Run migrations
        run: bun db:migrate
      - name: Run E2E tests
        run: bun run test:e2e
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
EOF
```

### Step 8.3: Deployment Workflow

```bash
cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run build
      - name: Deploy to production
        run: echo "Add deployment commands here"
        # For Vercel: npx vercel --prod
        # For Docker: docker build && docker push
EOF
```

**Verification:**
- Push to GitHub triggers CI
- Tests run automatically
- Workflows appear in Actions tab

---

## Phase 9: Example Apps & Templates

Phases 9-12 outline implementation but require significant code. Key files to create:

### Phase 9: Example Apps (Brief outline)
- Create `apps/web/pages/examples/` directory
- Implement 5+ example apps as documented in IDEA.md:
  1. AI Blog Generator
  2. Ad Creative Studio
  3. Landing Page Builder
  4. Email Funnel Designer
  5. Brand Package Creator

Each requires: pages, components, API routes, DB models.

---

## Phase 10: Testing & Quality

### Step 10.1: Setup Vitest

```bash
cat > vitest.config.ts << 'EOF'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/'],
    },
  },
})
EOF
```

### Step 10.2: Setup Playwright

```bash
bunx playwright install

cat > playwright.config.ts << 'EOF'
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
  webServer: {
    command: 'bun run dev:web',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
EOF
```

### Step 10.3: Example Tests

```bash
mkdir -p tests/unit tests/e2e

# Unit test example
cat > tests/unit/utils.test.ts << 'EOF'
import { describe, it, expect } from 'vitest'
import { slugify } from '@bistro/lib/utils'

describe('slugify', () => {
  it('converts text to slug', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })
})
EOF

# E2E test example
cat > tests/e2e/homepage.spec.ts << 'EOF'
import { test, expect } from '@playwright/test'

test('homepage loads', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('Bistro')
})
EOF
```

**Verification:**
- `bun run test` runs unit tests
- `bun run test:e2e` runs E2E tests

---

## Phase 11: Documentation & Guides

Create comprehensive docs in `apps/docs/content/`:

### Step 11.1: Create Core Documentation Pages

```bash
cd apps/docs

# Configuration guide
cat > content/docs/getting-started/configuration.md << 'EOF'
---
title: Configuration
---

# Configuration

Learn how to configure Bistro for your needs.

## Environment Variables

Required variables:
- `DATABASE_URL` - PostgreSQL connection
- `AUTH_SECRET` - Random 32-char string
- `OPENAI_API_KEY` - OpenAI API key (optional)

## Nuxt Config

Edit `nuxt.config.ts` to customize...
EOF

# Deployment guide
cat > content/docs/guides/deployment.md << 'EOF'
---
title: Deployment
---

# Deployment

## Docker Deployment

```bash
docker build -t my-saas .
docker run -p 3000:3000 my-saas
```

## Vercel Deployment

```bash
bunx vercel --prod
```
EOF
```

---

## Phase 12: Polish & Launch Prep

### Step 12.1: Performance Optimization

```bash
# Add to nuxt.config.ts
cat >> apps/web/nuxt.config.ts << 'EOF'
  nitro: {
    compressPublicAssets: true,
    minify: true,
  },

  experimental: {
    payloadExtraction: true,
  },
EOF
```

### Step 12.2: Production Dockerfile

```bash
cat > Dockerfile << 'EOF'
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS install
COPY package.json bun.lockb ./
COPY apps/web/package.json ./apps/web/
COPY packages/*/package.json ./packages/*/
RUN bun install --frozen-lockfile

# Build application
FROM base AS build
COPY --from=install /app/node_modules ./node_modules
COPY . .
RUN bun run build:web

# Production
FROM base AS release
COPY --from=build /app/apps/web/.output ./output
EXPOSE 3000
CMD ["bun", "run", "./output/server/index.mjs"]
EOF
```

### Step 12.3: Launch Checklist

```bash
cat > LAUNCH_CHECKLIST.md << 'EOF'
# Launch Checklist

## Pre-Launch
- [ ] All tests passing
- [ ] Performance optimized (Lighthouse > 90)
- [ ] Security audit complete
- [ ] Documentation complete
- [ ] Error tracking configured (Sentry)
- [ ] Analytics setup
- [ ] Environment variables documented

## Launch Day
- [ ] Deploy to production
- [ ] Verify all services running
- [ ] Test critical paths
- [ ] Monitor error rates
- [ ] Post on Product Hunt
- [ ] Share on Twitter/X
- [ ] Submit to /r/SideProject

## Post-Launch
- [ ] Monitor performance
- [ ] Respond to issues
- [ ] Collect feedback
- [ ] Plan v0.2.0 features
EOF
```

**Verification:**
- Production build works
- Docker image builds and runs
- All checklist items addressable

---

## Quick Commands Reference

```bash
# Development
bun run dev              # Start all apps
bun run dev:web          # Start starter kit
bun run dev:landing      # Start landing page

# Database
bun run db:migrate       # Run migrations
bun run db:studio        # Open Prisma Studio
bun run db:seed          # Seed database

# Testing
bun run test             # Run unit tests
bun run test:e2e         # Run e2e tests

# Build
bun run build            # Build all apps
bun run typecheck        # Type check all packages

# Docker
docker compose up -d     # Start services
docker compose down      # Stop services
docker compose logs -f   # View logs
```

---

## Dependencies Installation Summary

After completing all phases, run:

```bash
bun install
```

Total packages to install:
- Root: ~10 dev dependencies
- apps/web: ~20 dependencies
- apps/landing: ~15 dependencies
- apps/docs: ~15 dependencies
- packages/cli: ~10 dependencies
- packages/ui: ~5 dependencies
- packages/database: ~3 dependencies
- packages/lib: ~2 dependencies
- packages/config: ~10 dependencies

---

## Completion Checklist

- [ ] Phase 0: Repository setup complete
- [ ] Phase 1: Monorepo foundation working
- [ ] Phase 2: Core packages functional
- [ ] Phase 3: Starter kit app running
- [ ] Phase 4: Landing page deployed
- [ ] Phase 5: Docs site accessible
- [ ] Phase 6: CLI tool working
- [ ] Phase 7: IDE configs in place
- [ ] Phase 8: CI/CD pipeline active
- [ ] Phase 9: Example apps complete
- [ ] Phase 10: Tests passing (>80% coverage)
- [ ] Phase 11: Documentation complete
- [ ] Phase 12: Ready for launch

---

**Estimated Total Time:** 30 days (with 1-2 developers)
**Lines of Code:** ~15,000-20,000 LOC
**Files to Create:** ~200+ files
