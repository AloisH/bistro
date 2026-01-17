<script setup lang="ts">
defineProps<{
  icon: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
  actionIcon?: string;
}>();
</script>

<template>
  <div class="py-12 text-center">
    <UIcon
      :name="icon"
      class="mx-auto mb-4 h-12 w-12 text-neutral-400 dark:text-neutral-500"
    />
    <h2 class="mb-2 text-lg font-semibold">
      {{ title }}
    </h2>
    <p
      v-if="description"
      class="mb-6 text-sm text-neutral-500 dark:text-neutral-400"
    >
      {{ description }}
    </p>
    <UButton
      v-if="actionLabel && actionTo"
      :to="actionTo"
      :icon="actionIcon"
    >
      {{ actionLabel }}
    </UButton>
  </div>
</template>
