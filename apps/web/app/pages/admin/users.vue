<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="User Management">
        <template #right>
          <UColorModeButton />
        </template>
      </UDashboardNavbar>
    </template>

    <div class="mb-6">
      <h1 class="text-2xl font-bold">User Management</h1>
      <p class="text-sm text-neutral-600 dark:text-neutral-400">
        Manage users and impersonate for support
      </p>
    </div>

    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">All Users</h2>
          <UBadge color="neutral">{{ users.length }} users</UBadge>
        </div>
      </template>

      <UTable
        :data="users"
        :columns="columns"
        :loading="loading"
      />
    </UCard>

    <UModal v-model:open="isModalOpen">
      <template #content="{ close }">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold">Impersonate User</h3>
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-x"
                aria-label="Close modal"
                @click="close"
              />
            </div>
          </template>

          <div class="space-y-4">
            <div>
              <p class="text-sm text-neutral-600 dark:text-neutral-400">You are about to impersonate:</p>
              <p class="mt-1 font-semibold">{{ selectedUser?.name || selectedUser?.email }}</p>
              <p class="text-sm text-neutral-500">{{ selectedUser?.email }}</p>
            </div>

            <UFormField
              label="Reason (optional)"
              help="Document why you're impersonating this user"
            >
              <UTextarea
                v-model="impersonateReason"
                placeholder="e.g., Debug checkout issue"
                :rows="3"
              />
            </UFormField>

            <UAlert
              color="warning"
              icon="i-lucide-alert-triangle"
              title="Important"
              description="Some actions are restricted during impersonation. The session will auto-expire after 1 hour."
            />
          </div>

          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton
                color="neutral"
                variant="subtle"
                @click="close"
              >
                Cancel
              </UButton>
              <UButton
                color="warning"
                :loading="impersonating"
                @click="handleImpersonate"
              >
                Start Impersonating
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { h, resolveComponent } from 'vue';
import type { User as PrismaUser } from '../../../prisma/generated/client';

// Serialized user type (dates are strings after JSON serialization)
type User = Omit<PrismaUser, 'createdAt' | 'updatedAt'> & {
  createdAt: string | Date;
  updatedAt: string | Date;
};

definePageMeta({
  layout: 'dashboard',
});

const { isSuperAdmin } = useRole();
const { startImpersonation } = useImpersonation();
const { redirectToUserDashboard } = useAuth();
const toast = useToast();

// Check if user is super admin on mount
onMounted(() => {
  if (!isSuperAdmin.value) {
    toast.add({
      title: 'Access denied',
      description: 'You do not have permission to access this page',
      color: 'error',
      icon: 'i-lucide-alert-triangle',
    });
    navigateTo({ name: 'index' });
  }
});

// State
const loading = ref(false);
const users = ref<User[]>([]);
const isModalOpen = ref(false);
const selectedUser = ref<User | null>(null);
const impersonateReason = ref('');
const impersonating = ref(false);

// Table columns with cell renderers
const columns = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email',
  },
  {
    id: 'role',
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }: { row: { original: User } }) =>
      h(
        resolveComponent('UBadge'),
        { color: getRoleColor(row.original.role), icon: getRoleIcon(row.original.role) },
        () => row.original.role,
      ),
  },
  {
    id: 'emailVerified',
    accessorKey: 'emailVerified',
    header: 'Verified',
    cell: ({ row }: { row: { original: User } }) => (row.original.emailVerified ? 'Yes' : 'No'),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }: { row: { original: User } }) => {
      if (row.original.role === 'SUPER_ADMIN') {
        return h('span', { class: 'text-xs text-neutral-400' }, 'Cannot impersonate');
      }
      return h(
        resolveComponent('UButton'),
        {
          size: 'xs',
          color: 'warning',
          variant: 'soft',
          onClick: () => openImpersonateModal(row.original),
        },
        () => 'Impersonate',
      );
    },
  },
];

// Fetch users on mount
onMounted(async () => {
  await fetchUsers();
});

async function fetchUsers() {
  loading.value = true;
  try {
    const response = await $fetch('/api/admin/users');
    users.value = response.users;
  } catch (err) {
    const error = err as { data?: { message?: string } };
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to fetch users',
      color: 'error',
      icon: 'i-lucide-alert-triangle',
    });
  } finally {
    loading.value = false;
  }
}

function getRoleColor(role: string) {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'error';
    case 'ADMIN':
      return 'warning';
    case 'USER':
      return 'neutral';
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
    case 'USER':
      return 'i-lucide-user';
    default:
      return 'i-lucide-user';
  }
}

function openImpersonateModal(user: User) {
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
  if (!selectedUser.value) return;

  impersonating.value = true;
  const result = await startImpersonation(
    selectedUser.value.id,
    impersonateReason.value || undefined,
  );
  impersonating.value = false;

  if (result.success) {
    toast.add({
      title: 'Impersonation started',
      description: `Now viewing as ${selectedUser.value.name || selectedUser.value.email}`,
      color: 'success',
      icon: 'i-lucide-check',
    });
    closeModal();
    await redirectToUserDashboard();
  } else {
    toast.add({
      title: 'Error',
      description: result.error || 'Failed to start impersonation',
      color: 'error',
      icon: 'i-lucide-alert-triangle',
    });
  }
}
</script>
