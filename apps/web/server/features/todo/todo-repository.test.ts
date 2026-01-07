import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { startTransaction, rollbackTransaction } from '../../utils/testDb';
import { createTestUser, createTestTodo } from '../../utils/testFixtures';
import { todoRepository } from './todo-repository';

describe('TodoRepository (Integration)', () => {
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
      expect(result.map(t => t.id)).toContain(todo1.id);
      expect(result.map(t => t.id)).toContain(todo2.id);
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

    it('filters active todos', async () => {
      const user = await createTestUser();
      await createTestTodo(user.id, { completed: false });
      await createTestTodo(user.id, { completed: true });

      const result = await todoRepository.findByUserId(user.id, { filter: 'active' });

      expect(result).toHaveLength(1);
      expect(result[0].completed).toBe(false);
    });

    it('filters completed todos', async () => {
      const user = await createTestUser();
      await createTestTodo(user.id, { completed: false });
      await createTestTodo(user.id, { completed: true });

      const result = await todoRepository.findByUserId(user.id, { filter: 'completed' });

      expect(result).toHaveLength(1);
      expect(result[0].completed).toBe(true);
    });

    it('sorts by date descending by default', async () => {
      const user = await createTestUser();
      const todo1 = await createTestTodo(user.id, { title: 'First' });
      const todo2 = await createTestTodo(user.id, { title: 'Second' });

      const result = await todoRepository.findByUserId(user.id);

      // Most recent first (todo2 created after todo1)
      expect(result[0].id).toBe(todo2.id);
      expect(result[1].id).toBe(todo1.id);
    });

    it('sorts by title when specified', async () => {
      const user = await createTestUser();
      await createTestTodo(user.id, { title: 'Zebra' });
      await createTestTodo(user.id, { title: 'Apple' });

      const result = await todoRepository.findByUserId(user.id, { sort: 'title' });

      expect(result[0].title).toBe('Apple');
      expect(result[1].title).toBe('Zebra');
    });
  });

  describe('findById', () => {
    it('finds todo by id for correct user', async () => {
      const user = await createTestUser();
      const todo = await createTestTodo(user.id, { title: 'Find me' });

      const result = await todoRepository.findById(todo.id, user.id);

      expect(result).not.toBeNull();
      expect(result?.title).toBe('Find me');
    });

    it('returns null if todo belongs to different user', async () => {
      const user1 = await createTestUser();
      const user2 = await createTestUser();
      const todo = await createTestTodo(user1.id);

      const result = await todoRepository.findById(todo.id, user2.id);

      expect(result).toBeNull();
    });

    it('returns null if todo does not exist', async () => {
      const user = await createTestUser();

      const result = await todoRepository.findById('nonexistent-id', user.id);

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('creates todo with title only', async () => {
      const user = await createTestUser();

      const result = await todoRepository.create(user.id, { title: 'New task' });

      expect(result.id).toBeDefined();
      expect(result.title).toBe('New task');
      expect(result.description).toBeNull();
      expect(result.completed).toBe(false);
      expect(result.userId).toBe(user.id);
    });

    it('creates todo with description', async () => {
      const user = await createTestUser();

      const result = await todoRepository.create(user.id, {
        title: 'Task with details',
        description: 'More info here',
      });

      expect(result.title).toBe('Task with details');
      expect(result.description).toBe('More info here');
    });
  });

  describe('update', () => {
    it('updates todo title', async () => {
      const user = await createTestUser();
      const todo = await createTestTodo(user.id, { title: 'Original' });

      const result = await todoRepository.update(todo.id, user.id, { title: 'Updated' });

      expect(result.title).toBe('Updated');
      expect(result.id).toBe(todo.id);
    });

    it('updates todo completed status', async () => {
      const user = await createTestUser();
      const todo = await createTestTodo(user.id, { completed: false });

      const result = await todoRepository.update(todo.id, user.id, { completed: true });

      expect(result.completed).toBe(true);
    });

    it('updates multiple fields', async () => {
      const user = await createTestUser();
      const todo = await createTestTodo(user.id);

      const result = await todoRepository.update(todo.id, user.id, {
        title: 'Updated Title',
        description: 'Updated Description',
        completed: true,
      });

      expect(result.title).toBe('Updated Title');
      expect(result.description).toBe('Updated Description');
      expect(result.completed).toBe(true);
    });
  });

  describe('delete', () => {
    it('deletes todo', async () => {
      const user = await createTestUser();
      const todo = await createTestTodo(user.id);

      const result = await todoRepository.delete(todo.id);

      expect(result.id).toBe(todo.id);

      // Verify deleted
      const found = await todoRepository.findById(todo.id, user.id);
      expect(found).toBeNull();
    });
  });
});
