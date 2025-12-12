<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <h2 class="text-2xl font-bold">Reset password</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Enter your email to receive a reset link
        </p>
      </template>

      <UForm
        :state="state"
        :schema="forgotPasswordSchema"
        @submit="onSubmit"
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
          color="red"
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
          Send reset link
        </UButton>
      </UForm>

      <template #footer>
        <p class="text-center text-sm text-gray-600 dark:text-gray-400">
          Remember your password?
          <NuxtLink
            to="/auth/login"
            class="text-primary hover:underline"
          >
            Sign in
          </NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { forgotPasswordSchema } from '#shared/schemas/auth';
import { authClient } from '../../../lib/auth-client';

const toast = useToast();
const config = useRuntimeConfig();

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
    const result = await authClient.requestPasswordReset({
      email: state.email,
      redirectTo: `${config.public.appUrl}/auth/reset-password`,
    });

    if (result.error) {
      error.value = result.error.message || 'Failed to send reset email';
      return;
    }

    toast.add({
      title: 'Email sent',
      description: 'Check your inbox for the reset link',
      color: 'success',
      icon: 'i-lucide-mail-check',
    });

    await navigateTo(`/auth/forgot-password-sent?email=${encodeURIComponent(state.email)}`);
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
    console.error('Forgot password error:', e);
  } finally {
    loading.value = false;
  }
}
</script>
