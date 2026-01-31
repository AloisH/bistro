import { todoService } from '../../features/todo/todo-service';
import { defineApiHandler } from '../../utils/api-handler';

defineRouteMeta({
  openAPI: {
    tags: ['Todos'],
    description: 'Get a single todo by ID',
    parameters: [{ in: 'path', name: 'todoId', required: true, description: 'Todo ID' }],
  },
});

export default defineApiHandler(async (ctx) => {
  const todoId = getRouterParam(ctx.event, 'todoId');
  if (!todoId) {
    throw createError({ statusCode: 400, message: 'Todo ID required' });
  }

  const todo = await todoService.getTodo(todoId, ctx.userId);
  return { todo };
});
