<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
});

const { t } = useI18n();
const { isSuperAdmin } = useRole();
const toast = useToast();

// Permission gate
onMounted(() => {
  if (!isSuperAdmin.value) {
    toast.add({
      title: t('admin.users.toast.accessDenied'),
      description: t('admin.users.toast.accessDeniedDescription'),
      color: 'error',
      icon: 'i-lucide-alert-triangle',
    });
    navigateTo({ name: 'index' });
  }
});

const {
  users,
  loading,
  selectedUser,
  isModalOpen,
  impersonateReason,
  impersonating,
  fetchUsers,
  openImpersonateModal,
  handleImpersonate,
  getRoleColor,
  getRoleIcon,
} = useAdminUsers();

onMounted(fetchUsers);
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold">
        {{ $t('admin.users.title') }}
      </h1>
      <p class="text-sm text-neutral-600 dark:text-neutral-400">
        {{ $t('admin.users.description') }}
      </p>
    </div>

    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">
            {{ $t('admin.users.allUsers') }}
          </h2>
          <UBadge color="neutral">
            {{ $t('admin.users.userCount', { count: users.length }) }}
          </UBadge>
        </div>
      </template>

      <AdminUserTable
        :users="users"
        :loading="loading"
        :get-role-color="getRoleColor"
        :get-role-icon="getRoleIcon"
        @impersonate="openImpersonateModal"
      />
    </UCard>

    <AdminImpersonationModal
      v-model="isModalOpen"
      v-model:reason="impersonateReason"
      :user="selectedUser"
      :loading="impersonating"
      @confirm="handleImpersonate"
    />
  </div>
</template>
