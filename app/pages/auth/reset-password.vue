<script setup lang="ts">
import { resetPasswordSchema } from '#shared/auth';

const { t } = useI18n();
const localePath = useLocalePath();
const { state, loading, error, submit } = usePasswordReset();
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <h2 class="text-2xl font-bold">
          {{ $t('auth.resetPassword.title') }}
        </h2>
        <p class="text-sm text-neutral-500 dark:text-neutral-400">
          {{ $t('auth.resetPassword.description') }}
        </p>
      </template>

      <UForm
        :state="state"
        :schema="resetPasswordSchema"
        @submit.prevent="submit"
      >
        <UFormField
          name="password"
          :label="t('auth.resetPassword.newPasswordLabel')"
        >
          <UInput
            v-model="state.password"
            type="password"
            :placeholder="t('auth.resetPassword.passwordPlaceholder')"
            autocomplete="new-password"
          />
        </UFormField>

        <UFormField
          name="confirmPassword"
          :label="t('auth.resetPassword.confirmPasswordLabel')"
          class="mt-4"
        >
          <UInput
            v-model="state.confirmPassword"
            type="password"
            :placeholder="t('auth.resetPassword.passwordPlaceholder')"
            autocomplete="new-password"
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
          {{ $t('auth.resetPassword.submitButton') }}
        </UButton>
      </UForm>

      <template #footer>
        <p class="text-center text-sm text-neutral-600 dark:text-neutral-400">
          {{ $t('auth.resetPassword.rememberPassword') }}
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
