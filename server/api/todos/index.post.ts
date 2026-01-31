import { createTodoSchema } from '#shared/todo';
import { todoService } from '../../features/todo/todo-service';
import { defineValidatedApiHandler } from '../../utils/api-handler';

defineRouteMeta({
  openAPI: {
    tags: ['Todos'],
    description: 'Create a new todo',
  },
});

export default defineValidatedApiHandler(createTodoSchema, async (ctx) => {
  const todo = await todoService.createTodo(ctx.userId, ctx.body!);
  return { todo };
});
