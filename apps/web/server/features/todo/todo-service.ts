import { todoRepository } from './todo-repository';
import type { CreateTodoInput, UpdateTodoInput } from '#shared/todo';
import type { Todo } from '../../../prisma/generated/client';

export class TodoService {
  async listTodos(
    userId: string,
    options?: { filter?: 'all' | 'active' | 'completed'; sort?: 'date' | 'title' },
  ): Promise<Todo[]> {
    return todoRepository.findByUserId(userId, options);
  }

  async getTodo(id: string, userId: string): Promise<Todo> {
    const todo = await todoRepository.findById(id, userId);
    if (!todo) {
      throw createError({
        statusCode: 404,
        message: 'Todo not found',
      });
    }
    return todo;
  }

  async createTodo(userId: string, input: CreateTodoInput): Promise<Todo> {
    return todoRepository.create(userId, input);
  }

  async updateTodo(id: string, userId: string, input: UpdateTodoInput): Promise<Todo> {
    // Verify ownership
    await this.getTodo(id, userId);
    return todoRepository.update(id, userId, input);
  }

  async deleteTodo(id: string, userId: string): Promise<void> {
    // Verify ownership
    await this.getTodo(id, userId);
    await todoRepository.delete(id);
  }

  async toggleTodo(id: string, userId: string, completed: boolean): Promise<Todo> {
    await this.getTodo(id, userId);
    return todoRepository.update(id, userId, { completed });
  }
}

export const todoService = new TodoService();
