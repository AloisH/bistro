<script setup lang="ts">
import type { AdminUser } from '~/composables/admin/useAdminUsers';
import { h, resolveComponent } from 'vue';

interface Props {
  users: AdminUser[];
  loading: boolean;
  getRoleColor: (role: string) => string;
  getRoleIcon: (role: string) => string;
}

const { users, loading, getRoleColor, getRoleIcon } = defineProps<Props>();

const emit = defineEmits<Emits>();

interface Emits {
  (e: 'impersonate', user: AdminUser): void;
}

const { t } = useI18n();

const columns = computed(() => [
  {
    id: 'name',
    accessorKey: 'name',
    header: t('admin.users.nameHeader'),
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: t('admin.users.emailHeader'),
  },
  {
    id: 'role',
    accessorKey: 'role',
    header: t('admin.users.roleHeader'),
    cell: ({ row }: { row: { original: AdminUser } }) =>
      h(
        resolveComponent('UBadge'),
        {
          color: getRoleColor(row.original.role),
          icon: getRoleIcon(row.original.role),
        },
        () => row.original.role,
      ),
  },
  {
    id: 'emailVerified',
    accessorKey: 'emailVerified',
    header: t('admin.users.verifiedHeader'),
    cell: ({ row }: { row: { original: AdminUser } }) =>
      row.original.emailVerified ? t('common.yes') : t('common.no'),
  },
  {
    id: 'actions',
    header: t('admin.users.actionsHeader'),
    cell: ({ row }: { row: { original: AdminUser } }) => {
      if (row.original.role === 'SUPER_ADMIN') {
        return h('span', { class: 'text-xs text-neutral-400' }, t('admin.users.cannotImpersonate'));
      }
      return h(
        resolveComponent('UButton'),
        {
          size: 'xs',
          color: 'warning',
          variant: 'soft',
          onClick: () => { emit('impersonate', row.original); },
        },
        () => t('admin.users.impersonate'),
      );
    },
  },
]);
</script>

<template>
  <UTable
    :data="users"
    :columns="columns"
    :loading="loading"
  />
</template>
