<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <h2 class="text-2xl font-bold">Login</h2>
        <p class="text-sm text-neutral-500 dark:text-neutral-400">Sign in to your account</p>
      </template>

      <UTabs
        v-model="activeTab"
        :items="tabItems"
        class="w-full"
      >
        <template #content="{ item }">
          <!-- Password Tab -->
          <div
            v-if="item.value === 'password'"
            class="pt-4"
          >
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
                  class="text-primary text-sm font-medium hover:underline"
                >
                  Forgot password?
                </NuxtLink>
              </div>

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
                Sign in
              </UButton>
            </UForm>
          </div>

          <!-- Magic Link Tab -->
          <div
            v-else-if="item.value === 'magic-link'"
            class="pt-4"
          >
            <UForm
              :state="magicLinkState"
              :schema="magicLinkSchema"
              @submit.prevent="onMagicLinkSubmit"
            >
              <UFormField
                name="email"
                label="Email"
              >
                <UInput
                  v-model="magicLinkState.email"
                  type="email"
                  placeholder="you@example.com"
                  autocomplete="email"
                />
              </UFormField>

              <p class="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
                We'll send you a link to sign in without a password.
              </p>

              <UAlert
                v-if="magicLinkError"
                color="error"
                variant="subtle"
                :title="magicLinkError"
                class="mt-4"
              />

              <UButton
                type="submit"
                block
                :loading="magicLinkLoading"
                size="xl"
                class="mt-6 font-semibold"
                icon="i-lucide-mail"
              >
                Send Magic Link
              </UButton>
            </UForm>
          </div>
        </template>
      </UTabs>

      <AuthOAuthButtons />

      <template #footer>
        <p class="text-muted text-center text-sm">
          Don't have an account?
          <NuxtLink
            to="/auth/register"
            class="text-primary font-semibold hover:underline"
          >
            Sign up
          </NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod';
import { signInSchema } from '#shared/auth';

const { signIn, fetchSession, redirectToUserDashboard, loggedIn, client } = useAuth();

// Tabs
const activeTab = ref('password');
const tabItems = [
  { label: 'Password', value: 'password', icon: 'i-lucide-key' },
  { label: 'Magic Link', value: 'magic-link', icon: 'i-lucide-mail' },
];

// Redirect if already authenticated (e.g., after OAuth callback)
onMounted(async () => {
  await fetchSession();
  if (loggedIn.value) {
    await redirectToUserDashboard();
  }
});

// Password form
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
    error.value = getErrorMessage(e);
  } finally {
    loading.value = false;
  }
}

// Magic link form
const magicLinkSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});
const magicLinkState = reactive({ email: '' });
const magicLinkLoading = ref(false);
const magicLinkError = ref('');

async function onMagicLinkSubmit() {
  magicLinkLoading.value = true;
  magicLinkError.value = '';

  try {
    await client.signIn.magicLink({
      email: magicLinkState.email,
      callbackURL: '/auth/login',
    });

    await navigateTo({ name: 'auth-magic-link-sent', query: { email: magicLinkState.email } });
  } catch (e: unknown) {
    magicLinkError.value = getErrorMessage(e);
  } finally {
    magicLinkLoading.value = false;
  }
}
</script>
