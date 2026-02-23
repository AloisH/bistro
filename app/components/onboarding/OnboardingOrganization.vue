<script setup lang="ts">
import type { CreateOrganizationInput } from '#shared/organization';
import { createOrganizationSchema } from '#shared/organization';

const { t } = useI18n();

const model = defineModel<CreateOrganizationInput>({ required: true });

const name = computed(() => model.value.name);
const slug = computed({
  get: () => model.value.slug,
  set: v => (model.value.slug = v),
});
useSlugify(name, slug);
</script>

<template>
  <div class="space-y-6">
    <div>
      <h3 class="mb-2 text-lg font-semibold">
        {{ $t('onboarding.organization.title') }}
      </h3>
      <p class="text-sm text-neutral-600 dark:text-neutral-400">
        {{ $t('onboarding.organization.description') }}
      </p>
    </div>

    <UForm
      :state="model"
      :schema="createOrganizationSchema"
    >
      <div class="space-y-4">
        <UFormField
          name="name"
          :label="t('onboarding.organization.nameLabel')"
          required
        >
          <UInput
            v-model="model.name"
            :placeholder="t('onboarding.organization.namePlaceholder')"
          />
        </UFormField>

        <UFormField
          name="slug"
          :label="t('onboarding.organization.slugLabel')"
          required
          :description="t('onboarding.organization.slugHint')"
        >
          <UInput
            v-model="model.slug"
            :placeholder="t('onboarding.organization.slugPlaceholder')"
          />
        </UFormField>

        <UFormField
          name="description"
          :label="t('onboarding.organization.descriptionLabel')"
        >
          <UTextarea
            v-model="model.description"
            :placeholder="t('onboarding.organization.descriptionPlaceholder')"
            :rows="3"
          />
        </UFormField>
      </div>
    </UForm>
  </div>
</template>
