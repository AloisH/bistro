<script setup lang="ts">
import type { AdminUser } from '~/composables/admin/useAdminUsers';

interface Props {
  user: AdminUser | null;
  loading: boolean;
}

defineProps<Props>();

defineEmits<Emits>();

interface Emits {
  (e: 'confirm'): void;
}

const model = defineModel<boolean>({ required: true });
const reason = defineModel<string>('reason', { required: true });
</script>

<template>
  <UModal v-model:open="model">
    <template #content="{ close }">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">
              {{ $t('admin.impersonation.impersonateUser') }}
            </h3>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-x"
              :aria-label="$t('admin.impersonation.closeModal')"
              @click="close"
            />
          </div>
        </template>

        <div class="space-y-4">
          <div>
            <p class="text-sm text-neutral-600 dark:text-neutral-400">
              {{ $t('admin.impersonation.aboutToImpersonate') }}
            </p>
            <p class="mt-1 font-semibold">
              {{ user?.name || user?.email }}
            </p>
            <p class="text-sm text-neutral-500">
              {{ user?.email }}
            </p>
          </div>

          <UFormField
            :label="$t('admin.impersonation.reasonLabel')"
            :help="$t('admin.impersonation.reasonHelp')"
          >
            <UTextarea
              v-model="reason"
              :placeholder="$t('admin.impersonation.reasonPlaceholder')"
              :rows="3"
            />
          </UFormField>

          <UAlert
            color="warning"
            icon="i-lucide-alert-triangle"
            :title="$t('admin.impersonation.importantTitle')"
            :description="$t('admin.impersonation.importantDescription')"
          />
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              color="neutral"
              variant="subtle"
              @click="close"
            >
              {{ $t('common.cancel') }}
            </UButton>
            <UButton
              color="warning"
              :loading="loading"
              @click="$emit('confirm')"
            >
              {{ $t('admin.impersonation.startButton') }}
            </UButton>
          </div>
        </template>
      </UCard>
    </template>
  </UModal>
</template>
