import { defineApiHandler } from '../../utils/api-handler';
import { todoService } from '../../features/todo/todo-service';

/**
 * GET /api/todos
 * List user's todos
 */
export default defineApiHandler(async (ctx) => {
  const todos = await todoService.listTodos(ctx.userId);
  return { todos };
});
