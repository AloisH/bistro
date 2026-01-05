<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <h2 class="text-2xl font-bold">Create new password</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">Enter your new password below</p>
      </template>

      <UForm
        :state="state"
        :schema="resetPasswordSchema"
        @submit.prevent="onSubmit"
      >
        <UFormField
          name="password"
          label="New password"
        >
          <UInput
            v-model="state.password"
            type="password"
            placeholder="••••••••"
            autocomplete="new-password"
          />
        </UFormField>

        <UFormField
          name="confirmPassword"
          label="Confirm password"
          class="mt-4"
        >
          <UInput
            v-model="state.confirmPassword"
            type="password"
            placeholder="••••••••"
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
          class="mt-6"
        >
          Reset password
        </UButton>
      </UForm>

      <template #footer>
        <p class="text-center text-sm text-gray-600 dark:text-gray-400">
          Remember your password?
          <NuxtLink
            to="/auth/login"
            class="text-primary hover:underline"
          > Sign in </NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { resetPasswordSchema } from '#shared/auth';
import { authClient } from '../../../lib/auth-client';

const route = useRoute();
const toast = useToast();

// Redirect if already authenticated
useAuthRedirect();

const token = ref(route.query.token as string);

// Redirect if no token
onMounted(() => {
  if (!token.value) {
    toast.add({
      title: 'Invalid link',
      description: 'Password reset link is missing or invalid',
      color: 'error',
      icon: 'i-lucide-alert-triangle',
    });
    navigateTo('/auth/forgot-password');
  }
});

const state = reactive({
  password: '',
  confirmPassword: '',
});

const loading = ref(false);
const error = ref('');

async function onSubmit() {
  loading.value = true;
  error.value = '';

  try {
    const result = await authClient.resetPassword({
      newPassword: state.password,
      token: token.value,
    });

    if (result.error) {
      error.value = result.error.message || 'Failed to reset password';
      return;
    }

    toast.add({
      title: 'Password updated',
      description: 'You can now sign in with your new password',
      color: 'success',
      icon: 'i-lucide-check',
    });

    await navigateTo('/auth/login');
  } catch (e: unknown) {
    const err = e as { status?: number };
    if (e instanceof TypeError && e.message.includes('fetch')) {
      error.value = 'Network error. Check your connection.';
    } else if (err?.status === 429) {
      error.value = 'Too many attempts. Try again later.';
    } else if (err?.status === 400) {
      error.value = 'Invalid or expired reset link';
    } else if (err?.status && err.status >= 500) {
      error.value = 'Server error. Try again later.';
    } else {
      error.value = 'An error occurred. Please try again.';
    }
    console.error('Reset password error:', e);
  } finally {
    loading.value = false;
  }
}
</script>
