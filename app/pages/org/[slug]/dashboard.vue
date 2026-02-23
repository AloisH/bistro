<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
});

const { fetchTodos } = useTodos();

onMounted(() => fetchTodos());
</script>

<template>
  <UCard>
    <template #header>
      <h1 class="text-3xl font-bold">
        {{ $t('org.dashboard.title') }}
      </h1>
    </template>

    <TodoList />
  </UCard>
</template>
