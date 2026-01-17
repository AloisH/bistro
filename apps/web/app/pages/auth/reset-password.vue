<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <h2 class="text-2xl font-bold">Create new password</h2>
        <p class="text-sm text-neutral-500 dark:text-neutral-400">Enter your new password below</p>
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
          size="xl"
          class="mt-6 font-semibold"
        >
          Reset password
        </UButton>
      </UForm>

      <template #footer>
        <p class="text-center text-sm text-neutral-600 dark:text-neutral-400">
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

const { fetchSession, redirectToUserDashboard, loggedIn, client } = useAuth();
const route = useRoute();
const toast = useToast();

const token = ref(route.query.token as string);

// Redirect if already authenticated, or if no token
onMounted(async () => {
  await fetchSession();
  if (loggedIn.value) {
    await redirectToUserDashboard();
    return;
  }

  if (!token.value) {
    toast.add({
      title: 'Invalid link',
      description: 'Password reset link is missing or invalid',
      color: 'error',
      icon: 'i-lucide-alert-triangle',
    });
    navigateTo({ name: 'auth-forgot-password' });
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
    const result = await client.resetPassword({
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

    await navigateTo({ name: 'auth-login' });
  } catch (e: unknown) {
    error.value = getErrorMessage(e, 'Invalid or expired reset link');
  } finally {
    loading.value = false;
  }
}
</script>
