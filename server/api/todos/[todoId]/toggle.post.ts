import { toggleTodoSchema } from '#shared/todo';
import { todoService } from '../../../features/todo/todo-service';
import { defineValidatedApiHandler } from '../../../utils/api-handler';

defineRouteMeta({
  openAPI: {
    tags: ['Todos'],
    description: 'Toggle todo completion status',
    parameters: [{ in: 'path', name: 'todoId', required: true, description: 'Todo ID' }],
  },
});

export default defineValidatedApiHandler(toggleTodoSchema, async (ctx) => {
  const todoId = getRouterParam(ctx.event, 'todoId');
  if (!todoId) {
    throw createError({ statusCode: 400, message: 'Todo ID required' });
  }

  const todo = await todoService.toggleTodo(todoId, ctx.userId, ctx.body!.completed);
  return { todo };
});
