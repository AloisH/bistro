import { defineValidatedApiHandler } from '../../../utils/api-handler';
import { toggleTodoSchema } from '#shared/todo';
import { todoService } from '../../../features/todo/todo-service';

/**
 * POST /api/todos/:id/toggle
 * Toggle todo completion
 */
export default defineValidatedApiHandler(toggleTodoSchema, async (ctx) => {
  const id = getRouterParam(ctx.event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, message: 'ID required' });
  }

  const todo = await todoService.toggleTodo(id, ctx.userId, ctx.body!.completed);
  return { todo };
});
