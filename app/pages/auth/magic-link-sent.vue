<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
const { client } = useAuth();
const route = useRoute();
const router = useRouter();
const toast = useToast();

const email = ref(route.query.email as string);

onMounted(() => {
  if (!email.value) {
    toast.add({
      title: t('auth.emailRequired'),
      description: t('auth.emailRequiredDescription'),
      color: 'error',
      icon: 'i-lucide-alert-triangle',
    });
    router.push({ name: 'auth-magic-link' });
  }
});

const { resending, cooldown, canResend, resend } = useResendCooldown();

function resendMagicLink() {
  resend(
    () => client.signIn.magicLink({ email: email.value, callbackURL: '/org/select' }),
    t('auth.magicLinkSent.heading'),
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
              {{ $t('auth.magicLinkSent.title') }}
            </h2>
            <p class="text-sm text-neutral-500 dark:text-neutral-400">
              {{ $t('auth.magicLinkSent.badge') }}
            </p>
          </div>
        </div>
      </template>

      <div class="space-y-4">
        <UAlert
          color="info"
          variant="subtle"
          :title="t('auth.magicLinkSent.heading')"
        >
          <template #description>
            <p class="text-sm">
              {{ $t('auth.magicLinkSent.description', { email }) }}
            </p>
          </template>
        </UAlert>

        <div class="space-y-2">
          <p class="text-sm text-neutral-600 dark:text-neutral-400">
            {{ $t('auth.magicLinkSent.resendHint') }}
          </p>

          <UButton
            block
            variant="outline"
            :loading="resending"
            :disabled="!canResend"
            @click="resendMagicLink"
          >
            <template v-if="cooldown > 0">
              {{ $t('auth.magicLinkSent.resendCountdown', { cooldown }) }}
            </template>
            <template v-else>
              {{ $t('auth.magicLinkSent.resendButton') }}
            </template>
          </UButton>
        </div>
      </div>

      <template #footer>
        <p class="text-center text-sm text-neutral-600 dark:text-neutral-400">
          {{ $t('auth.magicLinkSent.preferPassword') }}
          <NuxtLink
            :to="localePath('/auth/login')"
            class="text-primary hover:underline"
          >
            {{ $t('auth.magicLinkSent.signInWithPassword') }}
          </NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>
