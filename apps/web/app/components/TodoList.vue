<template>
  <div class="space-y-6">
    <!-- Create form -->
    <div class="space-y-3">
      <UInput
        v-model="newTodoTitle"
        placeholder="Todo title..."
        @keyup.enter="handleCreate"
      />
      <UTextarea
        v-model="newTodoDescription"
        placeholder="Description (optional)"
        :rows="2"
      />
      <UButton
        icon="i-lucide-plus"
        :loading="creating"
        :disabled="!newTodoTitle.trim()"
        @click="handleCreate"
      >
        Add Todo
      </UButton>
    </div>

    <!-- Loading state -->
    <div
      v-if="loading"
      class="py-8 text-center"
    >
      <UIcon
        name="i-lucide-loader-2"
        class="mx-auto mb-3 text-4xl animate-spin"
      />
      <p class="text-gray-500 dark:text-gray-400">
        Loading todos...
      </p>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="todos.length === 0"
      class="py-8 text-center text-gray-500 dark:text-gray-400"
    >
      <UIcon
        name="i-lucide-check-circle"
        class="mx-auto mb-3 text-4xl"
      />
      <p>No todos yet. Create your first one!</p>
    </div>

    <!-- Todo list -->
    <div
      v-else
      class="space-y-3"
    >
      <div
        v-for="todo in todos"
        :key="todo.id"
        class="flex items-start gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-700"
      >
        <UCheckbox
          :model-value="todo.completed"
          class="mt-1"
          @update:model-value="handleToggle(todo.id, $event)"
        />
        <div class="min-w-0 flex-1">
          <div
            class="truncate"
            :class="{
              'line-through text-gray-400 dark:text-gray-500': todo.completed,
              'font-medium text-gray-900 dark:text-white': !todo.completed,
            }"
          >
            {{ todo.title }}
          </div>
          <p
            v-if="todo.description"
            class="mt-1 text-sm text-gray-600 dark:text-gray-400"
            :class="{ 'line-through': todo.completed }"
          >
            {{ todo.description }}
          </p>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            <UIcon
              name="i-lucide-clock"
              class="mr-1 inline"
            />
            {{ formatTime(todo.createdAt) }}
          </p>
        </div>
        <UButton
          icon="i-lucide-trash-2"
          color="error"
          variant="ghost"
          size="sm"
          @click="handleDelete(todo.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { todos, loading, createTodo, toggleTodo, deleteTodo } = useTodos();

const newTodoTitle = ref('');
const newTodoDescription = ref('');
const creating = ref(false);

async function handleCreate() {
  if (!newTodoTitle.value.trim()) return;

  creating.value = true;
  try {
    await createTodo({
      title: newTodoTitle.value.trim(),
      description: newTodoDescription.value.trim() || undefined,
    });
    newTodoTitle.value = '';
    newTodoDescription.value = '';
  } finally {
    creating.value = false;
  }
}

async function handleToggle(id: string, completed: string | boolean) {
  await toggleTodo(id, Boolean(completed));
}

async function handleDelete(id: string) {
  await deleteTodo(id);
}

function formatTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;

  return new Date(date).toLocaleDateString();
}
</script>
