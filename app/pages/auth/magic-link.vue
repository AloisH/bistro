<script setup lang="ts">
import { magicLinkSchema } from '#shared/auth';

const { t } = useI18n();
const localePath = useLocalePath();
const { state, loading, error, submit } = useMagicLink();
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <h2 class="text-2xl font-bold">
          {{ $t('auth.magicLink.title') }}
        </h2>
        <p class="text-sm text-neutral-500 dark:text-neutral-400">
          {{ $t('auth.magicLink.description') }}
        </p>
      </template>

      <UForm
        :state="state"
        :schema="magicLinkSchema"
        @submit.prevent="submit"
      >
        <UFormField
          name="email"
          :label="t('common.email')"
        >
          <UInput
            v-model="state.email"
            type="email"
            :placeholder="t('auth.magicLink.emailPlaceholder')"
            autocomplete="email"
          />
        </UFormField>

        <UAlert
          v-if="error"
          color="error"
          variant="subtle"
          :title="error"
          class="mt-4"
        />

        <UButton
          type="submit"
          block
          :loading="loading"
          size="xl"
          class="mt-6 font-semibold"
        >
          {{ $t('auth.magicLink.submitButton') }}
        </UButton>
      </UForm>

      <template #footer>
        <p class="text-center text-sm text-neutral-600 dark:text-neutral-400">
          {{ $t('auth.magicLink.preferPassword') }}
          <NuxtLink
            :to="localePath('/auth/login')"
            class="text-primary hover:underline"
          >
            {{ $t('auth.magicLink.signInWithPassword') }}
          </NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>
