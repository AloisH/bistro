import type { CreateTodoInput, TodoQueryInput } from '#shared/todo';
import type { Prisma, Todo } from '../../../prisma/generated/client';
import { db } from '../../utils/db';

export class TodoRepository {
  protected readonly db = db;

  async findByUserId(
    userId: string,
    options?: Partial<TodoQueryInput>,
  ): Promise<{ todos: Todo[]; total: number }> {
    const { filter = 'all', sort = 'date', page = 1, limit = 10 } = options || {};

    const where: Prisma.TodoWhereInput = { userId };
    if (filter === 'active')
      where.completed = false;
    if (filter === 'completed')
      where.completed = true;

    const orderBy = sort === 'date' ? { createdAt: 'desc' as const } : { title: 'asc' as const };

    const [todos, total] = await Promise.all([
      this.db.todo.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.db.todo.count({ where }),
    ]);

    return { todos, total };
  }

  async findById(id: string, userId: string): Promise<Todo | null> {
    return this.db.todo.findFirst({
      where: { id, userId }, // CRITICAL: always filter by userId
    });
  }

  async create(userId: string, data: CreateTodoInput): Promise<Todo> {
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
