import type { AdminUser } from '#shared/user/types';

export type { AdminUser };

export function useAdminUsers() {
  const toast = useToast();
  const { startImpersonation } = useImpersonation();
  const { redirectToUserDashboard } = useAuth();
  const { t } = useI18n();

  // State
  const users = ref<AdminUser[]>([]);
  const loading = ref(false);
  const selectedUser = ref<AdminUser | null>(null);
  const isModalOpen = ref(false);
  const impersonateReason = ref('');
  const impersonating = ref(false);

  // Fetch users
  async function fetchUsers() {
    loading.value = true;
    try {
      const response = await $fetch('/api/admin/users');
      users.value = response.users;
    }
    catch (err) {
      const error = err as { data?: { message?: string } };
      toast.add({
        title: t('common.error'),
        description: error.data?.message || t('admin.users.toast.fetchError'),
        color: 'error',
        icon: 'i-lucide-alert-triangle',
      });
    }
    finally {
      loading.value = false;
    }
  }

  // Role helpers
  function getRoleColor(role: string) {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'error';
      case 'ADMIN':
        return 'warning';
      default:
        return 'neutral';
    }
  }

  function getRoleIcon(role: string) {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'i-lucide-crown';
      case 'ADMIN':
        return 'i-lucide-shield';
      default:
        return 'i-lucide-user';
    }
  }

  // Modal actions
  function openImpersonateModal(user: AdminUser) {
    selectedUser.value = user;
    impersonateReason.value = '';
    isModalOpen.value = true;
  }

  function closeModal() {
    isModalOpen.value = false;
    selectedUser.value = null;
    impersonateReason.value = '';
  }

  async function handleImpersonate() {
    if (!selectedUser.value)
      return;

    impersonating.value = true;
    const result = await startImpersonation(
      selectedUser.value.id,
      impersonateReason.value || undefined,
    );
    impersonating.value = false;

    if (result.success) {
      toast.add({
        title: t('admin.users.toast.impersonateSuccess'),
        description: t('admin.users.toast.impersonateSuccessDescription', { name: selectedUser.value.name || selectedUser.value.email }),
        color: 'success',
        icon: 'i-lucide-check',
      });
      closeModal();
      await redirectToUserDashboard();
    }
    else {
      toast.add({
        title: t('common.error'),
        description: result.error || 'Failed to start impersonation',
        color: 'error',
        icon: 'i-lucide-alert-triangle',
      });
    }
  }

  return {
    // State
    users,
    loading,
    selectedUser,
    isModalOpen,
    impersonateReason,
    impersonating,
    // Actions
    fetchUsers,
    openImpersonateModal,
    closeModal,
    handleImpersonate,
    // Helpers
    getRoleColor,
    getRoleIcon,
  };
}
