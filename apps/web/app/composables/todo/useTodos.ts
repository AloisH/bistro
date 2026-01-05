import type { Todo } from '../../../prisma/generated/client';
import type { CreateTodoInput } from '#shared/todo';

export function useTodos() {
  const route = useRoute();
  const router = useRouter();
  const todos = useState<Todo[]>('todos:list', () => []);
  const loading = useState('todos:loading', () => false);
  const toast = useToast();

  // URL-synced filter and sort state
  const filter = ref<'all' | 'active' | 'completed'>(
    (route.query.filter as 'all' | 'active' | 'completed') || 'all',
  );
  const sort = ref<'date' | 'title'>((route.query.sort as 'date' | 'title') || 'date');

  async function fetchTodos() {
    loading.value = true;
    try {
      const { todos: data } = await $fetch<{ todos: Todo[] }>('/api/todos', {
        query: { filter: filter.value, sort: sort.value },
      });
      todos.value = data;
    } catch {
      toast.add({
        title: 'Error',
        description: 'Failed to load todos',
        color: 'error',
        icon: 'i-lucide-alert-triangle',
      });
    } finally {
      loading.value = false;
    }
  }

  function setFilter(newFilter: 'all' | 'active' | 'completed') {
    filter.value = newFilter;
    const query: Record<string, string> = {};
    if (newFilter !== 'all') query.filter = newFilter;
    if (sort.value !== 'date') query.sort = sort.value;
    router.push({ query });
    fetchTodos();
  }

  function setSort(newSort: 'date' | 'title') {
    sort.value = newSort;
    const query: Record<string, string> = {};
    if (filter.value !== 'all') query.filter = filter.value;
    if (newSort !== 'date') query.sort = newSort;
    router.push({ query });
    fetchTodos();
  }

  // Watch route changes (back/forward navigation)
  watch(
    () => route.query,
    (newQuery) => {
      filter.value = (newQuery.filter as 'all' | 'active' | 'completed') || 'all';
      sort.value = (newQuery.sort as 'date' | 'title') || 'date';
      fetchTodos();
    },
  );

  async function createTodo(input: CreateTodoInput) {
    try {
      const { todo } = await $fetch<{ todo: Todo }>('/api/todos', {
        method: 'POST',
        body: input,
      });
      todos.value.unshift(todo);
    } catch {
      toast.add({
        title: 'Error',
        description: 'Failed to create todo',
        color: 'error',
        icon: 'i-lucide-alert-triangle',
      });
      throw new Error('Failed to create todo');
    }
  }

  async function toggleTodo(id: string, completed: boolean) {
    const todo = todos.value.find(t => t.id === id);
    if (todo) todo.completed = completed;

    try {
      await $fetch(`/api/todos/${id}/toggle`, {
        method: 'POST',
        body: { completed },
      });
    } catch {
      if (todo) todo.completed = !completed;
      toast.add({
        title: 'Error',
        description: 'Failed to update todo',
        color: 'error',
        icon: 'i-lucide-alert-triangle',
      });
    }
  }

  async function deleteTodo(id: string) {
    const index = todos.value.findIndex(t => t.id === id);
    const removed = todos.value.splice(index, 1);

    try {
      await $fetch(`/api/todos/${id}`, { method: 'DELETE' });
      toast.add({
        title: 'Success',
        description: 'Todo deleted',
        color: 'success',
        icon: 'i-lucide-check',
      });
    } catch {
      todos.value.splice(index, 0, ...removed);
      toast.add({
        title: 'Error',
        description: 'Failed to delete todo',
        color: 'error',
        icon: 'i-lucide-alert-triangle',
      });
    }
  }

  return {
    todos: readonly(todos),
    loading: readonly(loading),
    filter: readonly(filter),
    sort: readonly(sort),
    fetchTodos,
    setFilter,
    setSort,
    createTodo,
    toggleTodo,
    deleteTodo,
  };
}
