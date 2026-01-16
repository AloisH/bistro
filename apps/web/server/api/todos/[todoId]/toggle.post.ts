import { defineValidatedApiHandler } from '../../../utils/api-handler';
import { toggleTodoSchema } from '#shared/todo';
import { todoService } from '../../../features/todo/todo-service';

/**
 * POST /api/todos/:id/toggle
 * Toggle todo completion
 */
export default defineValidatedApiHandler(toggleTodoSchema, async (ctx) => {
  const todoId = getRouterParam(ctx.event, 'todoId');
  if (!todoId) {
    throw createError({ statusCode: 400, message: 'Todo ID required' });
  }

  const todo = await todoService.toggleTodo(todoId, ctx.userId, ctx.body!.completed);
  return { todo };
});
