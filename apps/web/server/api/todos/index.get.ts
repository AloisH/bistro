import { defineApiHandler } from '../../utils/api-handler';
import { todoService } from '../../features/todo/todo-service';
import { todoQuerySchema } from '#shared/todo';

/**
 * GET /api/todos
 * List user's todos with optional filtering, sorting, and pagination
 */
export default defineApiHandler(async (ctx) => {
  const query = getQuery(ctx.event);
  const { filter, sort, page, limit } = todoQuerySchema.parse(query);

  return todoService.listTodos(ctx.userId, { filter, sort, page, limit });
});
