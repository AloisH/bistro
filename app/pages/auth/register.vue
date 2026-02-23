<script setup lang="ts">
import { signUpSchema } from '#shared/auth';

const { t } = useI18n();
const localePath = useLocalePath();
const { state, loading, error, submit } = useAuthRegister();
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <h2 class="text-2xl font-bold">
          {{ $t('auth.register.title') }}
        </h2>
        <p class="text-sm text-neutral-500 dark:text-neutral-400">
          {{ $t('auth.register.description') }}
        </p>
      </template>

      <UForm
        :state="state"
        :schema="signUpSchema"
        @submit.prevent="submit"
      >
        <UFormField
          name="name"
          :label="t('auth.register.nameLabel')"
        >
          <UInput
            v-model="state.name"
            type="text"
            :placeholder="t('auth.register.namePlaceholder')"
            autocomplete="name"
          />
        </UFormField>

        <UFormField
          name="email"
          :label="t('auth.register.emailLabel')"
          class="mt-4"
        >
          <UInput
            v-model="state.email"
            type="email"
            :placeholder="t('auth.register.emailPlaceholder')"
            autocomplete="email"
          />
        </UFormField>

        <UFormField
          name="password"
          :label="t('auth.register.passwordLabel')"
          class="mt-4"
        >
          <UInput
            v-model="state.password"
            type="password"
            :placeholder="t('auth.register.passwordPlaceholder')"
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
          {{ $t('auth.register.submitButton') }}
        </UButton>
      </UForm>

      <AuthOAuthButtons />

      <template #footer>
        <p class="text-center text-sm text-neutral-600 dark:text-neutral-400">
          {{ $t('auth.register.hasAccount') }}
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
