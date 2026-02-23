<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
const { client } = useAuth();
const route = useRoute();
const router = useRouter();
const toast = useToast();
const config = useRuntimeConfig();

const email = ref(route.query.email as string);

onMounted(() => {
  if (!email.value) {
    toast.add({
      title: t('auth.emailRequired'),
      description: t('auth.emailRequiredDescription'),
      color: 'error',
      icon: 'i-lucide-alert-triangle',
    });
    router.push({ name: 'auth-forgot-password' });
  }
});

const { resending, cooldown, canResend, resend } = useResendCooldown();

function resendReset() {
  resend(
    () =>
      client.requestPasswordReset({
        email: email.value,
        redirectTo: `${config.public.appUrl}/auth/reset-password`,
      }),
    t('auth.resetPassword.toast.successDescription'),
  );
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
            <UIcon
              name="i-lucide-mail-check"
              class="text-primary h-6 w-6"
            />
          </div>
          <div>
            <h2 class="text-2xl font-bold">
              {{ $t('auth.forgotPasswordSent.title') }}
            </h2>
            <p class="text-sm text-neutral-500 dark:text-neutral-400">
              {{ $t('auth.forgotPasswordSent.badge') }}
            </p>
          </div>
        </div>
      </template>

      <div class="space-y-4">
        <UAlert
          color="info"
          variant="subtle"
          :title="t('auth.forgotPasswordSent.heading')"
        >
          <template #description>
            <p class="text-sm">
              {{ $t('auth.forgotPasswordSent.description', { email }) }}
            </p>
          </template>
        </UAlert>

        <div class="space-y-2">
          <p class="text-sm text-neutral-600 dark:text-neutral-400">
            {{ $t('auth.forgotPasswordSent.resendHint') }}
          </p>

          <UButton
            block
            variant="outline"
            :loading="resending"
            :disabled="!canResend"
            @click="resendReset"
          >
            <template v-if="cooldown > 0">
              {{ $t('auth.forgotPasswordSent.resendCountdown', { cooldown }) }}
            </template>
            <template v-else>
              {{ $t('auth.forgotPasswordSent.resendButton') }}
            </template>
          </UButton>
        </div>
      </div>

      <template #footer>
        <p class="text-center text-sm text-neutral-600 dark:text-neutral-400">
          {{ $t('auth.forgotPasswordSent.rememberPassword') }}
          <NuxtLink
            :to="localePath('/auth/login')"
            class="text-primary hover:underline"
          >
            {{ $t('common.signIn') }}
          </NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>
