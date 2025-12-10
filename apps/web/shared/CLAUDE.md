# Shared Code Guidelines

**Location:** Code shared between client (`app/`) and server (`server/`)
**Purpose:** Validation schemas, types, utilities used by both frontend and backend

---

## Critical Rules

### ❌ NEVER Import These in Shared Code

- **Prisma types:** Use local type definitions instead
- **Server utils:** `~/server/utils/*` breaks client builds
- **Client composables:** `~/composables/*` breaks server builds
- **Node.js modules:** `fs`, `path`, etc. (unless isomorphic)

### ✅ Safe Imports

- `zod` - Validation library
- Pure TypeScript types/interfaces
- Other `~/shared/*` files
- Prisma types from generated client (read-only type imports)

---

## File Organization

```
shared/
└── schemas/              # Zod validation schemas
    ├── common.ts         # idSchema, slugSchema, paginationSchema
    ├── user.ts           # updateProfileSchema, UserProfile
    └── project.ts        # createProjectSchema, updateProjectSchema
```

**Future expansion:**

- `types/` - Shared TypeScript interfaces
- `utils/` - Pure utility functions (no side effects)
- `constants/` - Static configuration data

---

## Current Schemas

### common.ts

- **`idSchema`** - CUID validation (`z.string().cuid()`)
- **`slugSchema`** - Lowercase alphanumeric + hyphens, 1-100 chars
- **`paginationSchema`** - Page/limit with defaults (page=1, limit=20)

### user.ts

- **`updateProfileSchema`** - Name (string, 1-100 chars), image (URL) - both optional
- **`UserProfile`** - Type helper for API responses (excludes password)

### project.ts

- **`createProjectSchema`** - Title (1-200), description (optional, max 1000), slug (required)
- **`updateProjectSchema`** - Partial update (all fields optional)
- **`ProjectResponse`** - Type helper omitting userId

---

## Schema Development Pattern

### 1. Define Zod Schema

```typescript
// shared/schemas/project.ts
export const createProjectSchema = z.object({
  title: z.string().min(1).max(200),
  slug: slugSchema,
});
```

### 2. Infer TypeScript Type

```typescript
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
```

### 3. Use in Server API Handler

```typescript
// server/api/projects/index.post.ts
import { defineValidatedApiHandler } from '~/server/utils/api-handler';
import { createProjectSchema } from '~/shared/schemas/project';

export default defineValidatedApiHandler(createProjectSchema, async (ctx) => {
  // ctx.body is typed as CreateProjectInput!
  const project = await projectService.createProject(ctx.userId, ctx.body!);
  return { project };
});
```

### 4. Reuse in Client Forms (Future)

```vue
<script setup lang="ts">
import { createProjectSchema } from '~/shared/schemas/project';

const result = createProjectSchema.safeParse(formData);
</script>
```

---

## Common Patterns

### Reusable Field Validators

Extract common validation logic:

```typescript
// shared/schemas/common.ts
export const titleSchema = z
  .string()
  .min(1, 'Title required')
  .max(200)
  .transform((val) => val.trim());

// Reuse across schemas
export const createPageSchema = z.object({ title: titleSchema });
export const updatePageSchema = z.object({ title: titleSchema.optional() });
```

### Transform After Validation

```typescript
// ✅ CORRECT: Validate length, THEN trim
z.string()
  .min(2)
  .max(100)
  .transform((val) => val.trim());

// ❌ WRONG: Trim happens before validation
z.string()
  .transform((val) => val.trim())
  .min(2);
```

### Optional vs Nullable

- `z.string().optional()` - Field can be omitted
- `z.string().nullable()` - Field must be present but can be null
- `z.string().nullable().optional()` - Can be omitted OR null

---

## Type Safety Rules

### Never Use Type Assertions

```typescript
// ❌ BANNED
const data = response as ApiResponse<User>;

// ✅ CORRECT: Use Zod validation
const data = apiResponseSchema(userSchema).parse(response);
```

### Always Explicit Types

```typescript
// ❌ Implicit any
content: z.any().optional();

// ✅ Explicit schema (define if needed)
content: tiptapContentSchema.optional();
```

### Remove Prisma Dependencies

```typescript
// ❌ WRONG: Couples shared to Prisma
import type { PageStatus } from '@prisma/client';
export type Status = PageStatus;

// ✅ CORRECT: Define locally
export type PageStatus = 'draft' | 'published' | 'archived';
```

---

## Testing Guidelines

### Test File Location

Co-locate with source: `project.ts` → `project.test.ts`

### Required Coverage

- ✅ Valid input cases
- ✅ Invalid input cases (each validation rule)
- ✅ Edge cases (empty, max length, special chars)
- ✅ Transform behavior (trim, lowercase, etc.)
- ✅ Boundary values (exactly min/max length)

### Example

```typescript
describe('createProjectSchema', () => {
  it('should accept valid input', () => {
    const result = createProjectSchema.parse({
      title: 'My Project',
      slug: 'my-project',
    });
    expect(result).toBeDefined();
  });

  it('should reject empty title', () => {
    expect(() => createProjectSchema.parse({ title: '', slug: 'test' })).toThrow();
  });

  it('should reject invalid slug', () => {
    expect(() => createProjectSchema.parse({ title: 'Test', slug: 'Invalid Slug!' })).toThrow();
  });
});
```

---

## Common Gotchas

### 1. Transform Order

Transforms run AFTER validation. Use `.refine()` to validate transformed value.

### 2. Schema Performance

Define schemas at module level, not inside functions:

```typescript
// ✅ CORRECT: Created once
export const createProjectSchema = z.object({
  /* ... */
});

// ❌ WRONG: Created on every call
export function validateProject(data: unknown) {
  const schema = z.object({
    /* ... */
  });
  return schema.parse(data);
}
```

### 3. Recursive Schemas

Use `z.lazy()` for self-referential types:

```typescript
const tiptapContentSchema: z.ZodType<TiptapContent> = z.lazy(() =>
  z.object({
    type: z.string(),
    content: z.array(tiptapContentSchema).optional(),
  }),
);
```

---

## Before Changing Shared Schemas

**Breaking changes affect BOTH client AND server**

### Pre-Change Checklist

- [ ] Search usage: `rg "schemaName" --files-with-matches`
- [ ] Check both `app/` and `server/` usage
- [ ] Consider backwards compatibility
- [ ] Update tests for new validation
- [ ] Run `bun typecheck`
- [ ] Run `bun test:run`

### Breaking Change Examples

- Changing field from optional to required
- Adding `.refine()` that rejects previously valid data
- Renaming exported schemas/types
- Changing min/max length constraints

---

## Documentation Standards

### When to Add JSDoc

- All exported functions
- Complex validation schemas
- Non-obvious regex patterns
- Reusable schema components

### Example

```typescript
/**
 * Validates project slug for creation
 * - Lowercase alphanumeric + hyphens only
 * - 1-100 chars
 * - No spaces or special characters
 */
export const slugSchema = z.string().regex(/^[a-z0-9-]+$/);
```

---

## Related Documentation

- [Main CLAUDE.md](../CLAUDE.md) - Project overview and philosophy
- [App CLAUDE.md](../app/CLAUDE.md) - Vue/Nuxt patterns
- [Server CLAUDE.md](../server/CLAUDE.md) - API/DB patterns
