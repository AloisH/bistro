<script setup lang="ts">
import { forgotPasswordSchema } from '#shared/auth';

const { t } = useI18n();
const localePath = useLocalePath();
const { state, loading, error, submit } = usePasswordResetRequest();
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <h2 class="text-2xl font-bold">
          {{ $t('auth.forgotPassword.title') }}
        </h2>
        <p class="text-sm text-neutral-500 dark:text-neutral-400">
          {{ $t('auth.forgotPassword.description') }}
        </p>
      </template>

      <UForm
        :state="state"
        :schema="forgotPasswordSchema"
        @submit.prevent="submit"
      >
        <UFormField
          name="email"
          :label="t('common.email')"
        >
          <UInput
            v-model="state.email"
            type="email"
            :placeholder="t('auth.forgotPassword.emailPlaceholder')"
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
          {{ $t('auth.forgotPassword.submitButton') }}
        </UButton>
      </UForm>

      <template #footer>
        <p class="text-center text-sm text-neutral-600 dark:text-neutral-400">
          {{ $t('auth.forgotPassword.rememberPassword') }}
          <NuxtLink
            :to="localePath('/auth/login')"
            class="text-primary hover:underline"
          >
            {{ $t('common.signIn') }}
          </NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>
