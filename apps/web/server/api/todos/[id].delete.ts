import { defineApiHandler } from '../../utils/api-handler';
import { todoService } from '../../features/todo/todo-service';

/**
 * DELETE /api/todos/:id
 * Delete todo
 */
export default defineApiHandler(async (ctx) => {
  const id = getRouterParam(ctx.event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, message: 'ID required' });
  }

  await todoService.deleteTodo(id, ctx.userId);
  return { success: true };
});
