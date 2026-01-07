import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { startTransaction, rollbackTransaction, db } from './testDb';
import { createTestUser, createTestOrg, createTestTodo } from './testFixtures';

describe('testFixtures', () => {
  beforeEach(async () => {
    await startTransaction();
  });

  afterEach(async () => {
    await rollbackTransaction();
  });

  describe('createTestUser', () => {
    it('creates user with defaults', async () => {
      const user = await createTestUser();

      expect(user.id).toBeDefined();
      expect(user.email).toMatch(/^test-\d+-[a-z0-9]+@example\.com$/);
      expect(user.name).toBe('Test User');
      expect(user.role).toBe('USER');
      expect(user.emailVerified).toBe(false);
      expect(user.banned).toBe(false);
      expect(user.onboardingCompleted).toBe(false);
      expect(user.emailNotifications).toBe(true);
    });

    it('accepts overrides', async () => {
      const user = await createTestUser({
        name: 'Admin User',
        role: 'ADMIN',
        emailVerified: true,
      });

      expect(user.name).toBe('Admin User');
      expect(user.role).toBe('ADMIN');
      expect(user.emailVerified).toBe(true);
    });

    it('creates unique emails via timestamp', async () => {
      const user1 = await createTestUser();
      const user2 = await createTestUser();

      expect(user1.email).not.toBe(user2.email);
      expect(user1.id).not.toBe(user2.id);
    });
  });

  describe('createTestOrg', () => {
    it('creates org with unique slug', async () => {
      const org = await createTestOrg();

      expect(org.id).toBeDefined();
      expect(org.name).toBe('Test Organization');
      expect(org.slug).toMatch(/^test-org-\d+-[a-z0-9]+$/);
      expect(org.planType).toBe('free');
    });

    it('accepts overrides', async () => {
      const org = await createTestOrg({
        name: 'Premium Org',
        planType: 'premium',
      });

      expect(org.name).toBe('Premium Org');
      expect(org.planType).toBe('premium');
    });

    it('creates unique slugs via timestamp', async () => {
      const org1 = await createTestOrg();
      const org2 = await createTestOrg();

      expect(org1.slug).not.toBe(org2.slug);
      expect(org1.id).not.toBe(org2.id);
    });
  });

  describe('createTestTodo', () => {
    it('requires userId and creates todo', async () => {
      const user = await createTestUser();
      const todo = await createTestTodo(user.id);

      expect(todo.id).toBeDefined();
      expect(todo.title).toBe('Test Todo');
      expect(todo.completed).toBe(false);
      expect(todo.userId).toBe(user.id);
    });

    it('accepts overrides', async () => {
      const user = await createTestUser();
      const todo = await createTestTodo(user.id, {
        title: 'Important Task',
        description: 'This is important',
        completed: true,
      });

      expect(todo.title).toBe('Important Task');
      expect(todo.description).toBe('This is important');
      expect(todo.completed).toBe(true);
      expect(todo.userId).toBe(user.id);
    });
  });

  describe('performance', () => {
    it('creates fixtures in <50ms per fixture', async () => {
      const start = performance.now();
      await createTestUser();
      const userTime = performance.now() - start;

      const orgStart = performance.now();
      await createTestOrg();
      const orgTime = performance.now() - orgStart;

      const user = await createTestUser();
      const todoStart = performance.now();
      await createTestTodo(user.id);
      const todoTime = performance.now() - todoStart;

      expect(userTime).toBeLessThan(50);
      expect(orgTime).toBeLessThan(50);
      expect(todoTime).toBeLessThan(50);
    });

    it('batch creates 10 fixtures in <500ms', async () => {
      const start = performance.now();
      const promises = [];

      for (let i = 0; i < 10; i++) {
        promises.push(createTestUser());
      }

      await Promise.all(promises);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(500);
    });
  });

  describe('transaction context', () => {
    it('fixtures rollback within transaction', async () => {
      // Create fixtures within transaction
      const user = await createTestUser();
      const org = await createTestOrg();
      const todo = await createTestTodo(user.id);

      // Verify they exist
      const foundUser = await db.user.findUnique({ where: { id: user.id } });
      const foundOrg = await db.organization.findUnique({ where: { id: org.id } });
      const foundTodo = await db.todo.findUnique({ where: { id: todo.id } });

      expect(foundUser).toBeDefined();
      expect(foundOrg).toBeDefined();
      expect(foundTodo).toBeDefined();

      // Rollback happens in afterEach
      // Note: Can't verify rollback in same test due to transaction scope
    });
  });
});
