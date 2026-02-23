<script setup lang="ts">
const { t } = useI18n();
const { fetchSession } = useAuth();
const router = useRouter();
const toast = useToast();

const restartOnboardingLoading = ref(false);

async function restartOnboarding() {
  restartOnboardingLoading.value = true;
  try {
    // Reset onboardingCompleted to false
    await $fetch('/api/user/onboarding/restart', {
      method: 'POST',
    });

    // Clear localStorage
    localStorage.removeItem('bistro:onboarding');

    // Fetch updated session
    await fetchSession();

    // Redirect to onboarding
    await router.push({ name: 'onboarding' });

    toast.add({
      title: t('profile.restartOnboarding.title'),
      description: t('profile.restartOnboarding.description'),
      color: 'success',
      icon: 'i-lucide-refresh-cw',
    });
  }
  catch (e: unknown) {
    toast.add({
      title: t('common.error'),
      description: getErrorMessage(e, 'Failed to restart onboarding'),
      color: 'error',
      icon: 'i-lucide-alert-circle',
    });
  }
  finally {
    restartOnboardingLoading.value = false;
  }
}
</script>

<template>
  <div class="border-default border-b pb-6">
    <div class="mb-6 flex flex-col items-start justify-between sm:flex-row sm:items-center">
      <div>
        <h2 class="text-lg font-semibold text-neutral-900 sm:text-xl dark:text-white">
          {{ $t('profile.restartOnboarding.title') }}
        </h2>
        <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {{ $t('profile.restartOnboarding.description') }}
        </p>
      </div>
    </div>
    <UButton
      color="neutral"
      variant="outline"
      size="lg"
      class="w-full sm:w-auto"
      :loading="restartOnboardingLoading"
      @click="restartOnboarding"
    >
      <template #leading>
        <UIcon
          v-if="!restartOnboardingLoading"
          name="i-lucide-refresh-cw"
          class="mr-2"
        />
      </template>
      {{ $t('profile.restartOnboarding.button') }}
    </UButton>
  </div>
</template>
