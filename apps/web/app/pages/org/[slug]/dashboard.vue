<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
});

const route = useRoute();
const slug = route.params.slug as string;

const { fetchTodos } = useTodos();

onMounted(() => fetchTodos());
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar :title="`${slug} Dashboard`">
        <template #right>
          <UColorModeButton />
        </template>
      </UDashboardNavbar>
    </template>

    <UCard>
      <template #header>
        <h1 class="text-3xl font-bold">
          My Todos
        </h1>
      </template>

      <TodoList />
    </UCard>
  </UDashboardPanel>
</template>
