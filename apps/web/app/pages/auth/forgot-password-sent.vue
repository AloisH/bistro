<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <UIcon
              name="i-lucide-mail-check"
              class="h-6 w-6 text-primary"
            />
          </div>
          <div>
            <h2 class="text-2xl font-bold">Check your email</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Reset link sent
            </p>
          </div>
        </div>
      </template>

      <div class="space-y-4">
        <UAlert
          color="info"
          variant="subtle"
          title="Password reset email sent"
        >
          <template #description>
            <p class="text-sm">
              We sent a password reset link to <strong>{{ email }}</strong>.
              Click the link to create a new password.
            </p>
          </template>
        </UAlert>

        <div class="space-y-2">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Didn't receive the email? Check spam or resend.
          </p>

          <UButton
            block
            variant="outline"
            :loading="resending"
            :disabled="!canResend"
            @click="resendReset"
          >
            <template v-if="cooldown > 0">
              Resend in {{ cooldown }}s
            </template>
            <template v-else>
              Resend reset email
            </template>
          </UButton>
        </div>
      </div>

      <template #footer>
        <p class="text-center text-sm text-gray-600 dark:text-gray-400">
          Remember your password?
          <NuxtLink
            to="/auth/login"
            class="text-primary hover:underline"
          >
            Sign in
          </NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { authClient } from '../../../lib/auth-client';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const config = useRuntimeConfig();

// Get email from query param
const email = ref(route.query.email as string);

// Redirect if no email
onMounted(() => {
  if (!email.value) {
    toast.add({
      title: 'Email required',
      description: 'Please enter your email first',
      color: 'error',
      icon: 'i-lucide-alert-triangle',
    });
    router.push('/auth/forgot-password');
  }
});

// Resend state
const resending = ref(false);
const cooldown = ref(0);
const canResend = computed(() => cooldown.value === 0 && !resending.value);
let cooldownTimer: NodeJS.Timeout | null = null;

// Cleanup timer on unmount
onBeforeUnmount(() => {
  if (cooldownTimer) {
    clearInterval(cooldownTimer);
  }
});

// Resend reset email
async function resendReset() {
  if (!canResend.value) return;

  resending.value = true;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (authClient as any).forgetPassword({
      email: email.value,
      redirectTo: `${config.public.appUrl}/auth/reset-password`,
    });

    toast.add({
      title: 'Email sent',
      description: 'Check your inbox for reset link',
      color: 'success',
      icon: 'i-lucide-mail-check',
    });

    // Start 60s cooldown
    cooldown.value = 60;
    cooldownTimer = setInterval(() => {
      cooldown.value--;
      if (cooldown.value <= 0 && cooldownTimer) {
        clearInterval(cooldownTimer);
        cooldownTimer = null;
      }
    }, 1000);
  } catch (e: unknown) {
    const err = e as { status?: number };
    if (err?.status === 429) {
      toast.add({
        title: 'Too many attempts',
        description: 'Please wait before trying again',
        color: 'error',
        icon: 'i-lucide-alert-triangle',
      });
    } else {
      toast.add({
        title: 'Failed to send',
        description: 'Please try again later',
        color: 'error',
        icon: 'i-lucide-alert-triangle',
      });
    }
    console.error('Resend error:', e);
  } finally {
    resending.value = false;
  }
}
</script>
