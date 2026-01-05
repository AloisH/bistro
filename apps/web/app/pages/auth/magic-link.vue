<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <h2 class="text-2xl font-bold">Magic Link Login</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Enter your email to receive a login link
        </p>
      </template>

      <UForm
        :state="state"
        :schema="magicLinkSchema"
        @submit.prevent="onSubmit"
      >
        <UFormField
          name="email"
          label="Email"
        >
          <UInput
            v-model="state.email"
            type="email"
            placeholder="you@example.com"
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
          class="mt-6"
        >
          Send magic link
        </UButton>
      </UForm>

      <template #footer>
        <p class="text-center text-sm text-gray-600 dark:text-gray-400">
          Prefer a password?
          <NuxtLink
            to="/auth/login"
            class="text-primary hover:underline"
          >
            Sign in with password
          </NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { magicLinkSchema } from '#shared/schemas/auth';
import { authClient } from '../../../lib/auth-client';

const toast = useToast();

// Redirect if already authenticated
useAuthRedirect();

const state = reactive({
  email: '',
});

const loading = ref(false);
const error = ref('');

async function onSubmit() {
  loading.value = true;
  error.value = '';

  try {
    const result = await authClient.signIn.magicLink({
      email: state.email,
      callbackURL: '/organizations/select',
    });

    if (result.error) {
      error.value = result.error.message || 'Failed to send magic link';
      return;
    }

    toast.add({
      title: 'Email sent',
      description: 'Check your inbox for the login link',
      color: 'success',
      icon: 'i-lucide-mail-check',
    });

    await navigateTo(`/auth/magic-link-sent?email=${encodeURIComponent(state.email)}`);
  } catch (e: unknown) {
    const err = e as { status?: number };
    if (e instanceof TypeError && e.message.includes('fetch')) {
      error.value = 'Network error. Check your connection.';
    } else if (err?.status === 429) {
      error.value = 'Too many attempts. Try again later.';
    } else if (err?.status && err.status >= 500) {
      error.value = 'Server error. Try again later.';
    } else {
      error.value = 'An error occurred. Please try again.';
    }
    console.error('Magic link error:', e);
  } finally {
    loading.value = false;
  }
}
</script>
