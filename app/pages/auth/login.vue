<script setup lang="ts">
const localePath = useLocalePath();

const {
  activeTab,
  tabItems,
  passwordState,
  passwordLoading,
  passwordError,
  submitPassword,
  magicLinkSchema,
  magicLinkState,
  magicLinkLoading,
  magicLinkError,
  submitMagicLink,
} = useAuthLogin();
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <h2 class="text-2xl font-bold">
          {{ $t('auth.login.title') }}
        </h2>
        <p class="text-sm text-neutral-500 dark:text-neutral-400">
          {{ $t('auth.login.description') }}
        </p>
      </template>

      <UTabs
        v-model="activeTab"
        :items="tabItems"
        class="w-full"
      >
        <template #content="{ item }">
          <div class="pt-4">
            <AuthPasswordLoginForm
              v-if="item.value === 'password'"
              v-model:state="passwordState"
              :loading="passwordLoading"
              :error="passwordError"
              @submit="submitPassword"
            />
            <AuthMagicLinkForm
              v-else-if="item.value === 'magic-link'"
              v-model:state="magicLinkState"
              :schema="magicLinkSchema"
              :loading="magicLinkLoading"
              :error="magicLinkError"
              @submit="submitMagicLink"
            />
          </div>
        </template>
      </UTabs>

      <AuthOAuthButtons />

      <template #footer>
        <p class="text-muted text-center text-sm">
          {{ $t('auth.login.noAccount') }}
          <NuxtLink
            :to="localePath('/auth/register')"
            class="text-primary font-semibold hover:underline"
          >
            {{ $t('common.signUp') }}
          </NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>
