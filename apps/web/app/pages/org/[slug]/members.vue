<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;

definePageMeta({
  middleware: 'auth',
});
</script>

<template>
  <div>
    <UContainer>
      <div class="py-8">
        <h1 class="text-3xl font-bold mb-4">
          Organization Members
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ slug }}
        </p>
      </div>
    </UContainer>
  </div>
</template>
