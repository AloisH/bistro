import { db } from '../../utils/db';
import type { Todo, Prisma } from '../../../prisma/generated/client';

export class TodoRepository {
  protected readonly db = db;

  async findByUserId(userId: string): Promise<Todo[]> {
    return this.db.todo.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, userId: string): Promise<Todo | null> {
    return this.db.todo.findFirst({
      where: { id, userId }, // CRITICAL: always filter by userId
    });
  }

  async create(userId: string, data: { title: string; description?: string }): Promise<Todo> {
    return this.db.todo.create({
      data: {
        title: data.title,
        description: data.description,
        user: { connect: { id: userId } },
      },
    });
  }

  async update(id: string, userId: string, data: Prisma.TodoUpdateInput): Promise<Todo> {
    return this.db.todo.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Todo> {
    return this.db.todo.delete({
      where: { id },
    });
  }
}

export const todoRepository = new TodoRepository();
