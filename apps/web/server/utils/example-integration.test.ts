/**
 * Example integration test demonstrating transaction-per-test pattern.
 *
 * This file shows:
 * - Transaction lifecycle (beforeEach/afterEach)
 * - Fixture factory usage with defaults and overrides
 * - Real-world CRUD scenarios
 * - Relationship creation patterns
 * - User isolation testing
 *
 * Copy this pattern for your integration tests.
 * See CLAUDE.md Test Infrastructure for comprehensive documentation.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { startTransaction, rollbackTransaction, db } from './testDb';
import { createTestUser, createTestOrg, createTestTodo } from './testFixtures';

describe('Example Integration Test Pattern', () => {
  // Transaction lifecycle - REQUIRED for all integration tests
  // This ensures complete test isolation and automatic cleanup
  beforeEach(async () => {
    await startTransaction();
  });

  afterEach(async () => {
    await rollbackTransaction();
  });

  describe('Basic CRUD Operations', () => {
    it('creates and retrieves user', async () => {
      // Arrange: Create test data using fixtures
      const user = await createTestUser({ name: 'John Doe' });

      // Act: Query database directly
      const found = await db.user.findUnique({ where: { id: user.id } });

      // Assert: Verify data matches expectations
      expect(found).toBeDefined();
      expect(found?.name).toBe('John Doe');
      expect(found?.id).toBe(user.id); // Use returned ID, not hardcoded
    });

    it('updates user data', async () => {
      // Create initial user
      const user = await createTestUser({ name: 'Original Name' });

      // Update user
      const updated = await db.user.update({
        where: { id: user.id },
        data: { name: 'Updated Name' },
      });

      // Verify update
      expect(updated.name).toBe('Updated Name');
      expect(updated.id).toBe(user.id);
    });

    it('deletes user', async () => {
      // Create user to delete
      const user = await createTestUser();

      // Delete user
      await db.user.delete({ where: { id: user.id } });

      // Verify deletion
      const found = await db.user.findUnique({ where: { id: user.id } });
      expect(found).toBeNull();
    });
  });

  describe('Relationships', () => {
    it('creates user with related todo', async () => {
      // Create parent entity first
      const user = await createTestUser();

      // Create child entity with relationship
      await createTestTodo(user.id, {
        title: 'Test Task',
        description: 'This is a test',
        completed: true,
      });

      // Verify relationship using Prisma include
      const userWithTodos = await db.user.findUnique({
        where: { id: user.id },
        include: { todos: true },
      });

      expect(userWithTodos?.todos).toHaveLength(1);
      expect(userWithTodos?.todos[0].title).toBe('Test Task');
      expect(userWithTodos?.todos[0].userId).toBe(user.id);
    });

    it('creates multiple todos for single user', async () => {
      const user = await createTestUser();

      // Create multiple related entities
      await createTestTodo(user.id, { title: 'First Task' });
      await createTestTodo(user.id, { title: 'Second Task' });
      await createTestTodo(user.id, { title: 'Third Task' });

      // Query with relationship
      const todos = await db.todo.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'asc' },
      });

      expect(todos).toHaveLength(3);
      expect(todos.map(t => t.title)).toEqual(['First Task', 'Second Task', 'Third Task']);
    });

    it('creates organization membership', async () => {
      const user = await createTestUser();
      const org = await createTestOrg();

      // Create relationship using Prisma directly (no fixture exists yet)
      const member = await db.organizationMember.create({
        data: {
          userId: user.id,
          organizationId: org.id,
          role: 'OWNER',
        },
      });

      expect(member.userId).toBe(user.id);
      expect(member.organizationId).toBe(org.id);
      expect(member.role).toBe('OWNER');

      // Verify relationship query
      const orgWithMembers = await db.organization.findUnique({
        where: { id: org.id },
        include: { members: true },
      });

      expect(orgWithMembers?.members).toHaveLength(1);
    });
  });

  describe('Fixture Overrides', () => {
    it('demonstrates user overrides', async () => {
      // Admin user with custom attributes
      const admin = await createTestUser({
        role: 'ADMIN',
        email: 'admin@company.com',
        name: 'Admin User',
        emailVerified: true,
      });

      expect(admin.role).toBe('ADMIN');
      expect(admin.email).toBe('admin@company.com');
      expect(admin.emailVerified).toBe(true);
    });

    it('demonstrates organization overrides', async () => {
      // Premium organization with custom settings
      const premiumOrg = await createTestOrg({
        planType: 'premium',
        name: 'Premium Corp',
        description: 'Enterprise customer',
      });

      expect(premiumOrg.planType).toBe('premium');
      expect(premiumOrg.name).toBe('Premium Corp');
      expect(premiumOrg.description).toBe('Enterprise customer');
    });

    it('demonstrates todo overrides', async () => {
      const user = await createTestUser();

      // Completed todo with all fields
      const completedTodo = await createTestTodo(user.id, {
        title: 'Urgent Task',
        description: 'Must be done immediately',
        completed: true,
      });

      expect(completedTodo.title).toBe('Urgent Task');
      expect(completedTodo.description).toBe('Must be done immediately');
      expect(completedTodo.completed).toBe(true);
    });
  });

  describe('User Isolation (CRITICAL)', () => {
    it('enforces user data isolation', async () => {
      // Create two separate users
      const user1 = await createTestUser();
      const user2 = await createTestUser();

      // Create todo for user1
      await createTestTodo(user1.id, { title: 'User 1 Task' });

      // Verify user2 cannot see user1's todo
      const user2Todos = await db.todo.findMany({
        where: { userId: user2.id },
      });

      expect(user2Todos).toHaveLength(0);

      // Verify user1 can see their own todo
      const user1Todos = await db.todo.findMany({
        where: { userId: user1.id },
      });

      expect(user1Todos).toHaveLength(1);
      expect(user1Todos[0].title).toBe('User 1 Task');
    });

    it('tests user-scoped queries', async () => {
      const user1 = await createTestUser();
      const user2 = await createTestUser();

      // Create todos for both users
      await createTestTodo(user1.id, { title: 'User 1 - Task 1' });
      await createTestTodo(user1.id, { title: 'User 1 - Task 2' });
      await createTestTodo(user2.id, { title: 'User 2 - Task 1' });

      // Query with user scope
      const user1Todos = await db.todo.findMany({
        where: { userId: user1.id },
      });

      const user2Todos = await db.todo.findMany({
        where: { userId: user2.id },
      });

      // Each user sees only their own todos
      expect(user1Todos).toHaveLength(2);
      expect(user2Todos).toHaveLength(1);
      expect(user1Todos.every(t => t.userId === user1.id)).toBe(true);
      expect(user2Todos.every(t => t.userId === user2.id)).toBe(true);
    });
  });

  describe('Filtering and Sorting', () => {
    it('filters todos by completion status', async () => {
      const user = await createTestUser();

      // Create mix of completed and active todos
      await createTestTodo(user.id, { title: 'Active 1', completed: false });
      await createTestTodo(user.id, { title: 'Completed 1', completed: true });
      await createTestTodo(user.id, { title: 'Active 2', completed: false });
      await createTestTodo(user.id, { title: 'Completed 2', completed: true });

      // Query active only
      const activeTodos = await db.todo.findMany({
        where: { userId: user.id, completed: false },
      });

      // Query completed only
      const completedTodos = await db.todo.findMany({
        where: { userId: user.id, completed: true },
      });

      expect(activeTodos).toHaveLength(2);
      expect(completedTodos).toHaveLength(2);
      expect(activeTodos.every(t => !t.completed)).toBe(true);
      expect(completedTodos.every(t => t.completed)).toBe(true);
    });

    it('sorts todos by creation date', async () => {
      const user = await createTestUser();

      // Create todos in order
      const todo1 = await createTestTodo(user.id, { title: 'First' });
      const todo2 = await createTestTodo(user.id, { title: 'Second' });
      const todo3 = await createTestTodo(user.id, { title: 'Third' });

      // Query with sort
      const todosNewestFirst = await db.todo.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      });

      // Most recent first
      expect(todosNewestFirst[0].id).toBe(todo3.id);
      expect(todosNewestFirst[1].id).toBe(todo2.id);
      expect(todosNewestFirst[2].id).toBe(todo1.id);
    });
  });

  describe('Edge Cases', () => {
    it('handles optional fields', async () => {
      const todo = await createTestUser().then(u =>
        createTestTodo(u.id, {
          description: null, // Optional field
        }),
      );

      expect(todo.description).toBeNull();
    });

    it('creates multiple fixtures without conflicts', async () => {
      // Timestamp + random ensures uniqueness
      const user1 = await createTestUser();
      const user2 = await createTestUser();
      const user3 = await createTestUser();

      // All have unique emails and IDs
      const emails = [user1.email, user2.email, user3.email];
      const uniqueEmails = new Set(emails);
      expect(uniqueEmails.size).toBe(3);

      const ids = [user1.id, user2.id, user3.id];
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(3);
    });

    it('handles empty query results', async () => {
      const user = await createTestUser();

      // Query for non-existent todos
      const todos = await db.todo.findMany({
        where: { userId: user.id },
      });

      expect(todos).toEqual([]);
      expect(todos).toHaveLength(0);
    });
  });
});
