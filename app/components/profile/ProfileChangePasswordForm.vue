<script setup lang="ts">
import { changePasswordSchema } from '#shared/user';

interface Emits {
  (e: 'changed'): void;
}

const emit = defineEmits<Emits>();

const { t } = useI18n();
const { client } = useAuth();
const toast = useToast();

const passwordState = ref({
  currentPassword: '',
  newPassword: '',
  revokeOtherSessions: true,
});
const passwordLoading = ref(false);

async function changePassword() {
  passwordLoading.value = true;
  try {
    await client.changePassword({
      currentPassword: passwordState.value.currentPassword,
      newPassword: passwordState.value.newPassword,
      revokeOtherSessions: passwordState.value.revokeOtherSessions,
    });
    passwordState.value.currentPassword = '';
    passwordState.value.newPassword = '';
    toast.add({
      title: t('profile.changePassword.toast.success'),
      description: t('profile.changePassword.toast.successDescription'),
      color: 'success',
      icon: 'i-lucide-check-circle',
    });
    // Emit event if sessions were revoked
    if (passwordState.value.revokeOtherSessions) {
      emit('changed');
    }
  }
  catch (e: unknown) {
    toast.add({
      title: t('profile.changePassword.toast.error'),
      description: getErrorMessage(e, 'Failed to change password. Please check your current password.'),
      color: 'error',
      icon: 'i-lucide-alert-circle',
    });
  }
  finally {
    passwordLoading.value = false;
  }
}
</script>

<template>
  <div class="border-default border-b pb-6">
    <div class="mb-6 flex flex-col items-start justify-between sm:flex-row sm:items-center">
      <div>
        <h2 class="text-lg font-semibold text-neutral-900 sm:text-xl dark:text-white">
          {{ $t('profile.changePassword.title') }}
        </h2>
        <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {{ $t('profile.changePassword.description') }}
        </p>
      </div>
      <UBadge
        color="neutral"
        variant="subtle"
        class="mt-2 sm:mt-0"
      >
        {{ $t('profile.changePassword.badge') }}
      </UBadge>
    </div>
    <UForm
      :state="passwordState"
      :schema="changePasswordSchema"
      class="space-y-4"
      @submit.prevent="changePassword"
    >
      <UFormField
        name="currentPassword"
        :label="$t('profile.changePassword.currentPasswordLabel')"
        :description="$t('profile.changePassword.currentPasswordHint')"
      >
        <UInput
          v-model="passwordState.currentPassword"
          type="password"
          :placeholder="$t('profile.changePassword.passwordPlaceholder')"
          size="lg"
        />
      </UFormField>

      <UFormField
        name="newPassword"
        :label="$t('profile.changePassword.newPasswordLabel')"
        :description="$t('profile.changePassword.newPasswordHint')"
      >
        <UInput
          v-model="passwordState.newPassword"
          type="password"
          :placeholder="$t('profile.changePassword.passwordPlaceholder')"
          size="lg"
        />
      </UFormField>

      <UFormField
        name="revokeOtherSessions"
        class="pt-2"
      >
        <template #label>
          <label class="flex cursor-pointer items-center gap-3">
            <UCheckbox v-model="passwordState.revokeOtherSessions" />
            <span class="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {{ $t('profile.changePassword.revokeSessionsLabel') }}
            </span>
          </label>
        </template>
        <template #description>
          <p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            {{ $t('profile.changePassword.revokeSessionsHint') }}
          </p>
        </template>
      </UFormField>

      <div class="pt-4">
        <UButton
          type="submit"
          :loading="passwordLoading"
          size="lg"
          color="primary"
          class="w-full sm:w-auto"
        >
          <template #leading>
            <UIcon
              v-if="!passwordLoading"
              name="i-lucide-lock"
              class="mr-2"
            />
          </template>
          {{ $t('profile.changePassword.submitButton') }}
        </UButton>
      </div>
    </UForm>
  </div>
</template>
