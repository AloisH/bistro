<template>
  <UAlert :color="color" :icon="icon" class="my-4">
    <template #description>
      <slot />
    </template>
  </UAlert>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    type?: 'info' | 'warning' | 'error' | 'success';
  }>(),
  {
    type: 'info',
  },
);

const colorMap: Record<string, 'info' | 'warning' | 'error' | 'success'> = {
  info: 'info',
  warning: 'warning',
  error: 'error',
  success: 'success',
};

const iconMap: Record<string, string> = {
  info: 'i-lucide-info',
  warning: 'i-lucide-alert-triangle',
  error: 'i-lucide-alert-circle',
  success: 'i-lucide-check-circle',
};

const color = computed(() => colorMap[props.type] || 'info');
const icon = computed(() => iconMap[props.type] || 'i-lucide-info');
</script>
