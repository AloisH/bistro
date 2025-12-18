<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
});

const route = useRoute();
const slug = route.params.slug as string;
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
          Organization Dashboard
        </h1>
      </template>

      <div class="space-y-6">
        <p class="text-gray-600 dark:text-gray-400">
          Welcome to {{ slug }}
        </p>
      </div>
    </UCard>
  </UDashboardPanel>
</template>
