import { todoService } from '../../features/todo/todo-service';
import { defineApiHandler } from '../../utils/api-handler';

defineRouteMeta({
  openAPI: {
    tags: ['Todos'],
    description: 'Delete a todo',
    parameters: [{ in: 'path', name: 'todoId', required: true, description: 'Todo ID' }],
  },
});

export default defineApiHandler(async (ctx) => {
  const todoId = getRouterParam(ctx.event, 'todoId');
  if (!todoId) {
    throw createError({ statusCode: 400, message: 'Todo ID required' });
  }

  await todoService.deleteTodo(todoId, ctx.userId);
  return { success: true };
});
