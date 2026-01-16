import { defineApiHandler } from '../../utils/api-handler';
import { todoService } from '../../features/todo/todo-service';

/**
 * DELETE /api/todos/:id
 * Delete todo
 */
export default defineApiHandler(async (ctx) => {
  const todoId = getRouterParam(ctx.event, 'todoId');
  if (!todoId) {
    throw createError({ statusCode: 400, message: 'Todo ID required' });
  }

  await todoService.deleteTodo(todoId, ctx.userId);
  return { success: true };
});
