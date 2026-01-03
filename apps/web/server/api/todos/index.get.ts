import { defineApiHandler } from '../../utils/api-handler';
import { todoService } from '../../features/todo/todo-service';
import { todoQuerySchema } from '#shared/schemas/todo';

/**
 * GET /api/todos
 * List user's todos with optional filtering and sorting
 */
export default defineApiHandler(async (ctx) => {
  const query = getQuery(ctx.event);
  const { filter, sort } = todoQuerySchema.parse(query);

  const todos = await todoService.listTodos(ctx.userId, { filter, sort });
  return { todos };
});
