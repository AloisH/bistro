<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
const { state, loading, schema, createOrganization } = useOrgCreate();
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <h1 class="text-2xl font-bold">
          {{ $t('org.create.title') }}
        </h1>
        <p class="text-sm text-neutral-500 dark:text-neutral-400">
          {{ $t('org.create.description') }}
        </p>
      </template>

      <UForm
        :state="state"
        :schema="schema"
        @submit.prevent="createOrganization"
      >
        <div class="space-y-4">
          <UFormField
            name="name"
            :label="t('org.create.nameLabel')"
            required
          >
            <UInput
              v-model="state.name"
              :placeholder="t('org.create.namePlaceholder')"
            />
          </UFormField>

          <UFormField
            name="slug"
            :label="t('org.create.slugLabel')"
            required
            :description="t('org.create.slugHint')"
          >
            <UInput
              v-model="state.slug"
              :placeholder="t('org.create.slugPlaceholder')"
            />
          </UFormField>

          <UFormField
            name="description"
            :label="t('org.create.descriptionLabel')"
          >
            <UTextarea
              v-model="state.description"
              :placeholder="t('org.create.descriptionPlaceholder')"
              :rows="3"
            />
          </UFormField>

          <div class="flex gap-2 pt-4">
            <UButton
              type="submit"
              :loading="loading"
              block
            >
              {{ $t('org.create.submitButton') }}
            </UButton>
            <UButton
              variant="ghost"
              :to="localePath('/org/select')"
              :disabled="loading"
            >
              {{ $t('common.cancel') }}
            </UButton>
          </div>
        </div>
      </UForm>
    </UCard>
  </div>
</template>
