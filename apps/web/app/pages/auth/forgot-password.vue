<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <h2 class="text-2xl font-bold">Reset password</h2>
        <p class="text-sm text-neutral-500 dark:text-neutral-400">
          Enter your email to receive a reset link
        </p>
      </template>

      <UForm
        :state="state"
        :schema="forgotPasswordSchema"
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
          size="xl"
          class="mt-6 font-semibold"
        >
          Send reset link
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
import { forgotPasswordSchema } from '#shared/auth';

const { fetchSession, redirectToUserDashboard, loggedIn, client } = useAuth();
const toast = useToast();
const config = useRuntimeConfig();

// Redirect if already authenticated
onMounted(async () => {
  await fetchSession();
  if (loggedIn.value) {
    await redirectToUserDashboard();
  }
});

const state = reactive({
  email: '',
});

const loading = ref(false);
const error = ref('');

async function onSubmit() {
  loading.value = true;
  error.value = '';

  try {
    const result = await client.requestPasswordReset({
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

    await navigateTo({ name: 'auth-forgot-password-sent', query: { email: state.email } });
  } catch (e: unknown) {
    error.value = getErrorMessage(e);
  } finally {
    loading.value = false;
  }
}
</script>
