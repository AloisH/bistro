import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { startTransaction, rollbackTransaction, db } from '../../testing/testDb';
import { createTestUser, createTestTodo } from '../../testing/testFixtures';
import { TodoService } from './todo-service';

describe('TodoService', () => {
  const service = new TodoService();

  beforeEach(async () => {
    await startTransaction();
  });

  afterEach(async () => {
    await rollbackTransaction();
  });

  describe('listTodos', () => {
    it('returns paginated user todos', async () => {
      const user = await createTestUser();
      await createTestTodo(user.id, { title: 'Todo 1' });
      await createTestTodo(user.id, { title: 'Todo 2' });

      const result = await service.listTodos(user.id);

      expect(result.todos).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
    });

    it('filters active todos', async () => {
      const user = await createTestUser();
      await createTestTodo(user.id, { title: 'Active', completed: false });
      await createTestTodo(user.id, { title: 'Completed', completed: true });

      const result = await service.listTodos(user.id, { filter: 'active' });

      expect(result.todos).toHaveLength(1);
      expect(result.todos[0]?.title).toBe('Active');
    });

    it('filters completed todos', async () => {
      const user = await createTestUser();
      await createTestTodo(user.id, { title: 'Active', completed: false });
      await createTestTodo(user.id, { title: 'Completed', completed: true });

      const result = await service.listTodos(user.id, { filter: 'completed' });

      expect(result.todos).toHaveLength(1);
      expect(result.todos[0]?.title).toBe('Completed');
    });

    it('does not return other user todos', async () => {
      const user1 = await createTestUser();
      const user2 = await createTestUser();
      await createTestTodo(user1.id, { title: 'User 1 Todo' });
      await createTestTodo(user2.id, { title: 'User 2 Todo' });

      const result = await service.listTodos(user1.id);

      expect(result.todos).toHaveLength(1);
      expect(result.todos[0]?.title).toBe('User 1 Todo');
    });
  });

  describe('createTodo', () => {
    it('creates todo with title', async () => {
      const user = await createTestUser();

      const result = await service.createTodo(user.id, { title: 'New Todo' });

      expect(result.title).toBe('New Todo');
      expect(result.completed).toBe(false);
      expect(result.userId).toBe(user.id);
    });

    it('creates todo with description', async () => {
      const user = await createTestUser();

      const result = await service.createTodo(user.id, {
        title: 'New Todo',
        description: 'Description here',
      });

      expect(result.description).toBe('Description here');
    });
  });

  describe('getTodo', () => {
    it('returns todo if found', async () => {
      const user = await createTestUser();
      const todo = await createTestTodo(user.id, { title: 'My Todo' });

      const result = await service.getTodo(todo.id, user.id);

      expect(result.id).toBe(todo.id);
      expect(result.title).toBe('My Todo');
    });

    it('throws 404 if not found', async () => {
      const user = await createTestUser();

      await expect(service.getTodo('nonexistent-id', user.id)).rejects.toMatchObject({
        statusCode: 404,
      });
    });

    it('throws 404 for other user todo', async () => {
      const user1 = await createTestUser();
      const user2 = await createTestUser();
      const todo = await createTestTodo(user1.id);

      await expect(service.getTodo(todo.id, user2.id)).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });

  describe('updateTodo', () => {
    it('updates todo title', async () => {
      const user = await createTestUser();
      const todo = await createTestTodo(user.id, { title: 'Old Title' });

      const result = await service.updateTodo(todo.id, user.id, { title: 'New Title' });

      expect(result.title).toBe('New Title');
    });

    it('updates todo completed status', async () => {
      const user = await createTestUser();
      const todo = await createTestTodo(user.id, { completed: false });

      const result = await service.updateTodo(todo.id, user.id, { completed: true });

      expect(result.completed).toBe(true);
    });

    it('throws 404 for other user todo', async () => {
      const user1 = await createTestUser();
      const user2 = await createTestUser();
      const todo = await createTestTodo(user1.id);

      await expect(
        service.updateTodo(todo.id, user2.id, { title: 'Hacked' }),
      ).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });

  describe('deleteTodo', () => {
    it('deletes todo', async () => {
      const user = await createTestUser();
      const todo = await createTestTodo(user.id);

      await service.deleteTodo(todo.id, user.id);

      const deleted = await db.todo.findUnique({ where: { id: todo.id } });
      expect(deleted).toBeNull();
    });

    it('throws 404 for other user todo', async () => {
      const user1 = await createTestUser();
      const user2 = await createTestUser();
      const todo = await createTestTodo(user1.id);

      await expect(service.deleteTodo(todo.id, user2.id)).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });

  describe('toggleTodo', () => {
    it('toggles todo to completed', async () => {
      const user = await createTestUser();
      const todo = await createTestTodo(user.id, { completed: false });

      const result = await service.toggleTodo(todo.id, user.id, true);

      expect(result.completed).toBe(true);
    });

    it('toggles todo to incomplete', async () => {
      const user = await createTestUser();
      const todo = await createTestTodo(user.id, { completed: true });

      const result = await service.toggleTodo(todo.id, user.id, false);

      expect(result.completed).toBe(false);
    });
  });
});
