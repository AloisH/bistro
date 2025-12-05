<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <h2 class="text-2xl font-bold">Login</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Sign in to your account
        </p>
      </template>

      <UForm
        :state="state"
        :schema="schema"
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
          Sign in
        </UButton>
      </UForm>

      <AuthOAuthButtons />

      <template #footer>
        <p class="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?
          <NuxtLink
            to="/auth/register"
            class="text-primary hover:underline"
          >
            Sign up
          </NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

const { signIn, fetchSession, loggedIn } = useAuth()

// Redirect if already authenticated (e.g., after OAuth callback)
onMounted(async () => {
  await fetchSession()
  if (loggedIn.value) {
    await navigateTo('/dashboard')
  }
})

const state = reactive({
  email: '',
  password: '',
})

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const loading = ref(false)
const error = ref('')

async function onSubmit() {
  loading.value = true
  error.value = ''

  try {
    const result = await signIn.email({
      email: state.email,
      password: state.password,
    })

    if (result.error) {
      error.value = result.error.message || 'Invalid email or password'
      return
    }

    await fetchSession()
    await navigateTo('/dashboard')
  } catch (e) {
    error.value = 'An error occurred. Please try again.'
    console.error('Login error:', e)
  } finally {
    loading.value = false
  }
}
</script>
