<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <h2 class="text-2xl font-bold">Login</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">Sign in to your account</p>
      </template>

      <UForm
        :state="state"
        :schema="signInSchema"
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

        <UFormField
          name="password"
          label="Password"
          class="mt-4"
        >
          <UInput
            v-model="state.password"
            type="password"
            placeholder="••••••••"
            autocomplete="current-password"
          />
        </UFormField>

        <div class="mt-2 flex items-center justify-end">
          <NuxtLink
            to="/auth/forgot-password"
            class="text-primary text-sm hover:underline font-medium transition-all hover:translate-x-1"
          >
            Forgot password?
          </NuxtLink>
        </div>

        <UAlert
          v-if="error"
          color="error"
          variant="subtle"
          :title="error"
          class="mt-4 animate-in fade-in slide-in-from-top duration-300"
        />

        <UButton
          type="submit"
          block
          :loading="loading"
          size="xl"
          class="mt-6 font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
        >
          Sign in
        </UButton>
      </UForm>

      <AuthOAuthButtons />

      <!-- Magic Link Option -->
      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200 dark:border-gray-800" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="bg-white px-2 text-gray-500 dark:bg-gray-950">Or</span>
          </div>
        </div>

        <UButton
          to="/auth/magic-link"
          variant="outline"
          block
          class="mt-4"
          icon="i-lucide-mail"
        >
          Login with Magic Link
        </UButton>
      </div>

      <template #footer>
        <p class="text-center text-sm text-muted">
          Don't have an account?
          <NuxtLink
            to="/auth/register"
            class="text-primary hover:underline font-semibold transition-all hover:translate-x-1 inline-block"
          >
            Sign up
          </NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { signInSchema } from '#shared/schemas/auth';

const { signIn, fetchSession, redirectToUserDashboard } = useAuth();

// Redirect if already authenticated (e.g., after OAuth callback)
useAuthRedirect();

const state = reactive({
  email: '',
  password: '',
});

const loading = ref(false);
const error = ref('');

async function onSubmit() {
  loading.value = true;
  error.value = '';

  try {
    const result = await signIn.email({
      email: state.email,
      password: state.password,
    });

    if (result.error) {
      error.value = result.error.message || 'Invalid email or password';
      return;
    }

    await fetchSession();
    await redirectToUserDashboard();
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
    console.error('Login error:', e);
  } finally {
    loading.value = false;
  }
}
</script>
