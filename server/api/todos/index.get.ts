import { defineApiHandler } from '../../utils/api-handler';
import { todoService } from '../../features/todo/todo-service';
import { todoQuerySchema } from '#shared/todo';

defineRouteMeta({
  openAPI: {
    tags: ['Todos'],
    description: 'List todos with filtering, sorting, pagination',
    parameters: [
      { in: 'query', name: 'filter', description: 'Filter: all, active, completed' },
      { in: 'query', name: 'sort', description: 'Sort: date, title, status' },
      { in: 'query', name: 'page', description: 'Page number' },
      { in: 'query', name: 'limit', description: 'Items per page' },
    ],
  },
});

export default defineApiHandler(async (ctx) => {
  const query = getQuery(ctx.event);
  const { filter, sort, page, limit } = todoQuerySchema.parse(query);

  return todoService.listTodos(ctx.userId, { filter, sort, page, limit });
});
