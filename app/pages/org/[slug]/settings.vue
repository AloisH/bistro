<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
});

const route = useRoute();
const slug = route.params.slug as string;
</script>

<template>
  <UCard>
    <template #header>
      <h1 class="text-3xl font-bold">
        {{ $t('org.settings.title') }}
      </h1>
    </template>

    <div class="space-y-6">
      <p class="text-neutral-600 dark:text-neutral-400">
        {{ $t('org.settings.description', { slug }) }}
      </p>
    </div>
  </UCard>
</template>
