import { defineValidatedApiHandler } from '../../utils/api-handler';
import { updateTodoSchema } from '#shared/todo';
import { todoService } from '../../features/todo/todo-service';

/**
 * PUT /api/todos/:id
 * Update todo
 */
export default defineValidatedApiHandler(updateTodoSchema, async (ctx) => {
  const todoId = getRouterParam(ctx.event, 'todoId');
  if (!todoId) {
    throw createError({ statusCode: 400, message: 'Todo ID required' });
  }

  const todo = await todoService.updateTodo(todoId, ctx.userId, ctx.body!);
  return { todo };
});
