<template>
  <div
    v-if="hasOAuth"
    class="mt-6 space-y-3"
  >
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t border-gray-300 dark:border-gray-700" />
      </div>
      <div class="relative flex justify-center text-xs uppercase">
        <span class="bg-white dark:bg-gray-950 px-2 text-gray-500 dark:text-gray-400">Or continue with</span>
      </div>
    </div>

    <UButton
      v-if="config.public.oauthGithubEnabled"
      block
      variant="outline"
      :loading="loading === 'github'"
      @click="signInWithGithub"
    >
      <template #leading>
        <UIcon name="i-simple-icons-github" />
      </template>
      Continue with GitHub
    </UButton>

    <UButton
      v-if="config.public.oauthGoogleEnabled"
      block
      variant="outline"
      :loading="loading === 'google'"
      @click="signInWithGoogle"
    >
      <template #leading>
        <UIcon name="i-simple-icons-google" />
      </template>
      Continue with Google
    </UButton>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const { signIn } = useAuth()
const loading = ref<'github' | 'google' | null>(null)

const hasOAuth = computed(() =>
  config.public.oauthGithubEnabled || config.public.oauthGoogleEnabled,
)

const signInWithGithub = () => {
  loading.value = 'github'
  signIn.social({ provider: 'github', callbackURL: '/dashboard' })
}

const signInWithGoogle = () => {
  loading.value = 'google'
  signIn.social({ provider: 'google', callbackURL: '/dashboard' })
}
</script>
