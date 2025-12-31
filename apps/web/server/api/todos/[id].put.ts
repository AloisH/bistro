import { defineValidatedApiHandler } from '../../utils/api-handler';
import { updateTodoSchema } from '#shared/schemas/todo';
import { todoService } from '../../features/todo/todo-service';

/**
 * PUT /api/todos/:id
 * Update todo
 */
export default defineValidatedApiHandler(updateTodoSchema, async (ctx) => {
  const id = getRouterParam(ctx.event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, message: 'ID required' });
  }

  const todo = await todoService.updateTodo(id, ctx.userId, ctx.body!);
  return { todo };
});
