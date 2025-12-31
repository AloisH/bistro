import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TodoService } from './todo-service';
import { todoRepository } from './todo-repository';
import type { Todo } from '../../../prisma/generated/client';

vi.mock('./todo-repository');

describe('TodoService', () => {
  const service = new TodoService();
  const mockUserId = 'user-123';

  const createMockTodo = (overrides: Partial<Todo> = {}): Todo => ({
    id: '1',
    title: 'Test',
    description: null,
    completed: false,
    userId: mockUserId,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listTodos', () => {
    it('should return user todos', async () => {
      const mockTodos = [createMockTodo()];
      vi.mocked(todoRepository.findByUserId).mockResolvedValue(mockTodos);

      const result = await service.listTodos(mockUserId);

      expect(result).toEqual(mockTodos);
      expect(todoRepository.findByUserId).toHaveBeenCalledWith(mockUserId);
    });
  });

  describe('createTodo', () => {
    it('should create todo', async () => {
      const input = { title: 'New todo' };
      const mockTodo = createMockTodo(input);
      vi.mocked(todoRepository.create).mockResolvedValue(mockTodo);

      const result = await service.createTodo(mockUserId, input);

      expect(result).toEqual(mockTodo);
      expect(todoRepository.create).toHaveBeenCalledWith(mockUserId, input);
    });
  });

  describe('getTodo', () => {
    it('should return todo if found', async () => {
      const mockTodo = createMockTodo();
      vi.mocked(todoRepository.findById).mockResolvedValue(mockTodo);

      const result = await service.getTodo('1', mockUserId);

      expect(result).toEqual(mockTodo);
    });

    it('should throw 404 if not found', async () => {
      vi.mocked(todoRepository.findById).mockResolvedValue(null);

      await expect(service.getTodo('1', mockUserId)).rejects.toThrow();
    });
  });

  describe('updateTodo', () => {
    it('should update todo', async () => {
      const mockTodo = createMockTodo();
      const input = { title: 'Updated' };
      const updatedTodo = createMockTodo({ ...mockTodo, ...input });
      vi.mocked(todoRepository.findById).mockResolvedValue(mockTodo);
      vi.mocked(todoRepository.update).mockResolvedValue(updatedTodo);

      const result = await service.updateTodo('1', mockUserId, input);

      expect(result.title).toBe('Updated');
    });
  });

  describe('deleteTodo', () => {
    it('should delete todo', async () => {
      const mockTodo = createMockTodo();
      vi.mocked(todoRepository.findById).mockResolvedValue(mockTodo);
      vi.mocked(todoRepository.delete).mockResolvedValue(mockTodo);

      await service.deleteTodo('1', mockUserId);

      expect(todoRepository.delete).toHaveBeenCalledWith('1');
    });
  });
});
