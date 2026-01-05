import { defineValidatedApiHandler } from '../../utils/api-handler';
import { createTodoSchema } from '#shared/todo';
import { todoService } from '../../features/todo/todo-service';

/**
 * POST /api/todos
 * Create todo
 */
export default defineValidatedApiHandler(createTodoSchema, async (ctx) => {
  const todo = await todoService.createTodo(ctx.userId, ctx.body!);
  return { todo };
});
