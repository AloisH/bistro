<script setup lang="ts">
const { t } = useI18n();

const model = defineModel<string>({ required: true });

const useCases = computed(() => [
  {
    value: 'personal',
    label: t('onboarding.useCase.personal'),
    description: t('onboarding.useCase.personalDescription'),
    icon: 'i-lucide-user',
  },
  {
    value: 'business',
    label: t('onboarding.useCase.business'),
    description: t('onboarding.useCase.businessDescription'),
    icon: 'i-lucide-briefcase',
  },
  {
    value: 'agency',
    label: t('onboarding.useCase.agency'),
    description: t('onboarding.useCase.agencyDescription'),
    icon: 'i-lucide-building',
  },
  {
    value: 'other',
    label: t('onboarding.useCase.other'),
    description: t('onboarding.useCase.otherDescription'),
    icon: 'i-lucide-help-circle',
  },
]);
</script>

<template>
  <div class="py-4">
    <div class="mb-6">
      <h2 class="mb-2 text-2xl font-bold">
        {{ $t('onboarding.useCase.title') }}
      </h2>
      <p class="text-neutral-600 dark:text-neutral-300">
        {{ $t('onboarding.useCase.description') }}
      </p>
    </div>

    <div class="space-y-3">
      <button
        v-for="useCase in useCases"
        :key="useCase.value"
        type="button"
        class="flex w-full items-start gap-4 rounded-lg border-2 p-4 text-left transition-all" :class="[
          model === useCase.value
            ? 'border-primary bg-primary/5'
            : 'border-default hover:border-neutral-400 dark:hover:border-neutral-500',
        ]"
        @click="model = useCase.value"
      >
        <div class="mt-0.5">
          <div
            class="flex h-5 w-5 items-center justify-center rounded-full border-2" :class="[
              model === useCase.value
                ? 'border-primary'
                : 'border-neutral-300 dark:border-neutral-600',
            ]"
          >
            <div
              v-if="model === useCase.value"
              class="bg-primary h-3 w-3 rounded-full"
            />
          </div>
        </div>
        <div class="flex-1">
          <div class="mb-1 flex items-center gap-2">
            <UIcon
              :name="useCase.icon"
              class="h-5 w-5"
            />
            <span class="font-medium">{{ useCase.label }}</span>
          </div>
          <p class="text-sm text-neutral-500 dark:text-neutral-400">
            {{ useCase.description }}
          </p>
        </div>
      </button>
    </div>
  </div>
</template>
