<script setup lang="ts">
const { modelValue } = defineProps<{
  modelValue: {
    bio: string;
    company: string;
  };
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: { bio: string; company: string }): void;
}>();

const localValue = computed({
  get: () => modelValue,
  set: (value) => emit('update:modelValue', value),
});
</script>

<template>
  <div class="py-4">
    <div class="mb-6">
      <h2 class="mb-2 text-2xl font-bold">Set up your profile</h2>
      <p class="text-neutral-600 dark:text-neutral-300">
        Tell us a bit about yourself (all fields optional)
      </p>
    </div>

    <div class="space-y-4">
      <div>
        <label class="mb-2 block text-sm font-medium"> Bio </label>
        <UTextarea v-model="localValue.bio" placeholder="Tell us about yourself..." :rows="4" />
        <p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          {{ localValue.bio?.length || 0 }} / 500
        </p>
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium"> Company / Organization </label>
        <UInput v-model="localValue.company" placeholder="Acme Inc." />
      </div>
    </div>
  </div>
</template>
