<script setup lang="ts">
import { deleteAccountEmailSchema, deleteAccountPasswordSchema } from '#shared/user';

interface Props {
  hasPassword: boolean;
}

const { hasPassword } = defineProps<Props>();

const { t } = useI18n();
const { user, signOut } = useAuth();
const toast = useToast();

const showDeleteModal = ref(false);
const deleteState = ref({
  password: '',
  email: '',
});
const deleteLoading = ref(false);

async function deleteAccount() {
  deleteLoading.value = true;
  try {
    const body = hasPassword ? { password: deleteState.value.password } : { email: deleteState.value.email };

    await $fetch('/api/user/account', {
      method: 'DELETE',
      body,
    });
    toast.add({
      title: t('profile.deleteAccount.toast.success'),
      description: t('profile.deleteAccount.toast.successDescription'),
      color: 'success',
      icon: 'i-lucide-check-circle',
    });
    await signOut({ redirectTo: '/auth/login' });
  }
  catch (e: unknown) {
    toast.add({
      title: t('profile.deleteAccount.toast.error'),
      description: getErrorMessage(e, 'Failed to delete account. Please verify your credentials.'),
      color: 'error',
      icon: 'i-lucide-alert-circle',
    });
  }
  finally {
    deleteLoading.value = false;
  }
}
</script>

<template>
  <div class="pb-6">
    <div class="mb-6 flex flex-col items-start justify-between sm:flex-row sm:items-center">
      <div>
        <h2 class="text-lg font-semibold text-red-600 sm:text-xl dark:text-red-400">
          {{ $t('profile.deleteAccount.title') }}
        </h2>
        <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {{ $t('profile.deleteAccount.description') }}
        </p>
      </div>
    </div>
    <UButton
      color="error"
      variant="solid"
      size="lg"
      class="w-full sm:w-auto"
      @click="showDeleteModal = true"
    >
      <template #leading>
        <UIcon
          name="i-lucide-trash-2"
          class="mr-2"
        />
      </template>
      {{ $t('profile.deleteAccount.deleteButton') }}
    </UButton>

    <!-- Delete Confirmation Modal -->
    <UModal
      v-model:open="showDeleteModal"
      :title="$t('profile.deleteAccount.modalTitle')"
      :description="$t('profile.deleteAccount.modalDescription')"
      :ui="{
        footer: 'flex flex-col sm:flex-row gap-3 w-full',
      }"
    >
      <template #body>
        <div class="space-y-4">
          <UAlert
            color="error"
            variant="subtle"
            :title="$t('profile.deleteAccount.irreversible')"
            :description="$t('profile.deleteAccount.irreversibleDescription')"
            class="mb-4"
          />

          <div>
            <p class="mb-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {{ $t('profile.deleteAccount.dataList') }}
            </p>
            <ul class="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <li class="flex items-start gap-2">
                <UIcon
                  name="i-lucide-user"
                  class="mt-1 text-neutral-400 dark:text-neutral-500"
                />
                <span>{{ $t('profile.deleteAccount.dataProfile') }}</span>
              </li>
              <li class="flex items-start gap-2">
                <UIcon
                  name="i-lucide-folder"
                  class="mt-1 text-neutral-400 dark:text-neutral-500"
                />
                <span>{{ $t('profile.deleteAccount.dataProjects') }}</span>
              </li>
              <li class="flex items-start gap-2">
                <UIcon
                  name="i-lucide-bot"
                  class="mt-1 text-neutral-400 dark:text-neutral-500"
                />
                <span>{{ $t('profile.deleteAccount.dataJobs') }}</span>
              </li>
              <li class="flex items-start gap-2">
                <UIcon
                  name="i-lucide-globe"
                  class="mt-1 text-neutral-400 dark:text-neutral-500"
                />
                <span>{{ $t('profile.deleteAccount.dataSessions') }}</span>
              </li>
            </ul>
          </div>

          <UForm
            :state="deleteState"
            :schema="hasPassword ? deleteAccountPasswordSchema : deleteAccountEmailSchema"
            class="space-y-4"
          >
            <UFormField
              v-if="hasPassword"
              name="password"
              :label="$t('profile.deleteAccount.passwordLabel')"
              :description="$t('profile.deleteAccount.passwordHint')"
            >
              <UInput
                v-model="deleteState.password"
                type="password"
                :placeholder="$t('profile.deleteAccount.passwordPlaceholder')"
                size="lg"
              />
            </UFormField>

            <UFormField
              v-else
              name="email"
              :label="$t('profile.deleteAccount.emailLabel')"
              :description="$t('profile.deleteAccount.emailHint')"
            >
              <UInput
                v-model="deleteState.email"
                type="email"
                :placeholder="user?.email"
                size="lg"
              />
            </UFormField>
          </UForm>
        </div>
      </template>

      <template #footer="{ close }">
        <div class="flex w-full flex-col gap-3 sm:ml-auto sm:w-auto sm:flex-row">
          <UButton
            variant="ghost"
            :disabled="deleteLoading"
            size="lg"
            class="w-full sm:w-auto"
            @click="close"
          >
            {{ $t('common.cancel') }}
          </UButton>
          <UButton
            color="error"
            type="submit"
            :loading="deleteLoading"
            size="lg"
            class="w-full sm:w-auto"
            @click="deleteAccount"
          >
            <template #leading>
              <UIcon
                v-if="!deleteLoading"
                name="i-lucide-trash-2"
                class="mr-2"
              />
            </template>
            {{ $t('profile.deleteAccount.confirmButton') }}
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
