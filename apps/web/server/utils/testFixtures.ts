import type { User, Organization, Todo, Prisma } from '@prisma/client';
import { db } from './testDb';

/**
 * Create a test user with sensible defaults.
 *
 * Email uniqueness is guaranteed via timestamp + random pattern. All fields
 * have sensible defaults but can be overridden via the overrides parameter.
 *
 * **Default Values:**
 * - email: `test-${Date.now()}-${random}@example.com` (unique)
 * - name: "Test User"
 * - role: "USER"
 * - emailVerified: false
 * - onboardingCompleted: false
 * - emailNotifications: true
 *
 * **Performance:** <50ms per fixture
 *
 * @param overrides - Partial user data to override defaults
 * @returns Created user object with generated CUID
 * @see CLAUDE.md Test Infrastructure for usage patterns
 *
 * @example
 * ```typescript
 * // Default user
 * const user = await createTestUser()
 *
 * // Admin user with custom email
 * const admin = await createTestUser({
 *   role: 'ADMIN',
 *   email: 'admin@test.com',
 *   emailVerified: true
 * })
 *
 * // Use returned ID for relationships
 * const todo = await createTestTodo(user.id)
 * ```
 */
export async function createTestUser(
  overrides?: Partial<Prisma.UserCreateInput>,
): Promise<User> {
  const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const defaults: Prisma.UserCreateInput = {
    email: `test-${uniqueSuffix}@example.com`,
    name: 'Test User',
    password: 'hashed-password-placeholder',
    emailVerified: false,
    role: 'USER',
    banned: false,
    onboardingCompleted: false,
    emailNotifications: true,
  };

  return await db.user.create({
    data: { ...defaults, ...overrides },
  });
}

/**
 * Create a test organization with unique slug.
 *
 * Slug uniqueness is guaranteed via timestamp + random pattern. Use this
 * fixture to test organization-scoped features and multi-tenancy.
 *
 * **Default Values:**
 * - name: "Test Organization"
 * - slug: `test-org-${Date.now()}-${random}` (unique)
 * - planType: "free"
 *
 * **Performance:** <50ms per fixture
 *
 * @param overrides - Partial organization data to override defaults
 * @returns Created organization object with generated CUID
 * @see CLAUDE.md Test Infrastructure for usage patterns
 *
 * @example
 * ```typescript
 * // Default organization
 * const org = await createTestOrg()
 *
 * // Premium organization with custom name
 * const premiumOrg = await createTestOrg({
 *   planType: 'premium',
 *   name: 'Premium Corp',
 *   description: 'Premium customer'
 * })
 *
 * // Create org membership
 * const user = await createTestUser()
 * await db.organizationMember.create({
 *   data: { userId: user.id, organizationId: org.id, role: 'OWNER' }
 * })
 * ```
 */
export async function createTestOrg(
  overrides?: Partial<Prisma.OrganizationCreateInput>,
): Promise<Organization> {
  const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const defaults: Prisma.OrganizationCreateInput = {
    name: 'Test Organization',
    slug: `test-org-${uniqueSuffix}`,
    planType: 'free',
  };

  return await db.organization.create({
    data: { ...defaults, ...overrides },
  });
}

/**
 * Create a test todo linked to a user.
 *
 * Todos require a valid userId - create a user first with createTestUser().
 * This demonstrates the parent-child relationship pattern used throughout
 * the codebase.
 *
 * **Default Values:**
 * - title: "Test Todo"
 * - description: null
 * - completed: false
 * - userId: (from parameter - required)
 *
 * **Performance:** <50ms per fixture
 *
 * @param userId - User ID that owns this todo (required - must exist)
 * @param overrides - Partial todo data to override defaults
 * @returns Created todo object with generated CUID
 * @see CLAUDE.md Test Infrastructure for usage patterns
 *
 * @example
 * ```typescript
 * // Basic todo
 * const user = await createTestUser()
 * const todo = await createTestTodo(user.id)
 *
 * // Completed todo with description
 * const completedTodo = await createTestTodo(user.id, {
 *   title: 'Important Task',
 *   description: 'This needs to be done',
 *   completed: true
 * })
 *
 * // Multiple todos for same user
 * const user = await createTestUser()
 * const todo1 = await createTestTodo(user.id, { title: 'First' })
 * const todo2 = await createTestTodo(user.id, { title: 'Second' })
 * ```
 */
export async function createTestTodo(
  userId: string,
  overrides?: Partial<Prisma.TodoCreateInput>,
): Promise<Todo> {
  const defaults: Prisma.TodoCreateInput = {
    title: 'Test Todo',
    completed: false,
    user: {
      connect: { id: userId },
    },
  };

  return await db.todo.create({
    data: { ...defaults, ...overrides },
  });
}
