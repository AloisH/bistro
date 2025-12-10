<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <h2 class="text-2xl font-bold">Create account</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">Sign up to get started</p>
      </template>

      <UForm
        :state="state"
        :schema="signUpSchema"
        @submit="onSubmit"
      >
        <UFormField
          name="name"
          label="Name"
        >
          <UInput
            v-model="state.name"
            type="text"
            placeholder="John Doe"
            autocomplete="name"
          />
        </UFormField>

        <UFormField
          name="email"
          label="Email"
          class="mt-4"
        >
          <UInput
            v-model="state.email"
            type="email"
            placeholder="you@example.com"
            autocomplete="email"
          />
        </UFormField>

        <UFormField
          name="password"
          label="Password"
          class="mt-4"
        >
          <UInput
            v-model="state.password"
            type="password"
            placeholder="••••••••"
            autocomplete="new-password"
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
          Create account
        </UButton>
      </UForm>

      <AuthOAuthButtons />

      <template #footer>
        <p class="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?
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
import { signUpSchema } from '#shared/schemas/auth';

const { signUp, fetchSession } = useAuth();

// Redirect if already authenticated (e.g., after OAuth callback)
useAuthRedirect();

const state = reactive({
  name: '',
  email: '',
  password: '',
});

const loading = ref(false);
const error = ref('');

async function onSubmit() {
  loading.value = true;
  error.value = '';

  try {
    const result = await signUp.email({
      name: state.name,
      email: state.email,
      password: state.password,
    });

    if (result.error) {
      error.value = result.error.message || 'Failed to create account';
      return;
    }

    await fetchSession();
    await navigateTo('/dashboard');
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
    console.error('Signup error:', e);
  } finally {
    loading.value = false;
  }
}
</script>
