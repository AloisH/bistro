<template>
  <UTable
    :data="users"
    :columns="columns"
    :loading="loading"
  />
</template>

<script setup lang="ts">
import { h, resolveComponent } from 'vue';
import type { AdminUser } from '~/composables/admin/useAdminUsers';

const props = defineProps<{
  users: AdminUser[];
  loading: boolean;
  getRoleColor: (role: string) => string;
  getRoleIcon: (role: string) => string;
}>();

const emit = defineEmits<{
  impersonate: [user: AdminUser];
}>();

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
    cell: ({ row }: { row: { original: AdminUser } }) =>
      h(
        resolveComponent('UBadge'),
        { color: props.getRoleColor(row.original.role), icon: props.getRoleIcon(row.original.role) },
        () => row.original.role,
      ),
  },
  {
    id: 'emailVerified',
    accessorKey: 'emailVerified',
    header: 'Verified',
    cell: ({ row }: { row: { original: AdminUser } }) => (row.original.emailVerified ? 'Yes' : 'No'),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }: { row: { original: AdminUser } }) => {
      if (row.original.role === 'SUPER_ADMIN') {
        return h('span', { class: 'text-xs text-neutral-400' }, 'Cannot impersonate');
      }
      return h(
        resolveComponent('UButton'),
        {
          size: 'xs',
          color: 'warning',
          variant: 'soft',
          onClick: () => emit('impersonate', row.original),
        },
        () => 'Impersonate',
      );
    },
  },
];
</script>
