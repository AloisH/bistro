import { defineApiHandler } from '../../utils/api-handler';
import { todoService } from '../../features/todo/todo-service';

/**
 * GET /api/todos/:id
 * Get single todo
 */
export default defineApiHandler(async (ctx) => {
  const todoId = getRouterParam(ctx.event, 'todoId');
  if (!todoId) {
    throw createError({ statusCode: 400, message: 'Todo ID required' });
  }

  const todo = await todoService.getTodo(todoId, ctx.userId);
  return { todo };
});
