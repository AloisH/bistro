<script setup lang="ts">
const { t } = useI18n();

const model = defineModel<{ bio: string; company: string }>({ required: true });
</script>

<template>
  <div class="py-4">
    <div class="mb-6">
      <h2 class="mb-2 text-2xl font-bold">
        {{ $t('onboarding.profile.title') }}
      </h2>
      <p class="text-neutral-600 dark:text-neutral-300">
        {{ $t('onboarding.profile.description') }}
      </p>
    </div>

    <div class="space-y-4">
      <div>
        <label
          for="profile-bio"
          class="mb-2 block text-sm font-medium"
        > {{ $t('onboarding.profile.bioLabel') }} </label>
        <UTextarea
          id="profile-bio"
          v-model="model.bio"
          :placeholder="t('onboarding.profile.bioPlaceholder')"
          :rows="4"
        />
        <p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          {{ $t('onboarding.profile.bioCount', { count: model.bio?.length || 0 }) }}
        </p>
      </div>

      <div>
        <label
          for="profile-company"
          class="mb-2 block text-sm font-medium"
        > {{ $t('onboarding.profile.companyLabel') }} </label>
        <UInput
          id="profile-company"
          v-model="model.company"
          :placeholder="t('onboarding.profile.companyPlaceholder')"
        />
      </div>
    </div>
  </div>
</template>
