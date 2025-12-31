import { defineApiHandler } from '../../utils/api-handler';
import { todoService } from '../../features/todo/todo-service';

/**
 * GET /api/todos/:id
 * Get single todo
 */
export default defineApiHandler(async (ctx) => {
  const id = getRouterParam(ctx.event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, message: 'ID required' });
  }

  const todo = await todoService.getTodo(id, ctx.userId);
  return { todo };
});
