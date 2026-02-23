<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui';

const { t } = useI18n();
const { session, user, isPending, signOut } = useAuth();
const { isSuperAdmin } = useRole();
const localePath = useLocalePath();

// Build menu items dynamically based on role
const menuItems = computed<DropdownMenuItem[][]>(() => {
  const items: DropdownMenuItem[][] = [
    [
      {
        label: user.value?.email || '',
        icon: 'i-lucide-user',
        disabled: true,
      },
    ],
    [
      {
        label: t('nav.profile'),
        icon: 'i-lucide-settings',
        to: localePath('/profile'),
      },
    ],
  ];

  // Add admin panel link if super admin
  if (isSuperAdmin.value) {
    items.push([
      {
        label: t('nav.admin'),
        icon: 'i-lucide-shield',
        to: localePath('/admin/users'),
      },
    ]);
  }

  // Add logout at the end
  items.push([
    {
      label: t('nav.logout'),
      icon: 'i-lucide-log-out',
      onSelect: () => signOut({ redirectTo: '/' }),
    },
  ]);

  return items;
});
</script>

<template>
  <div v-if="!isPending">
    <UButton
      v-if="!session"
      :to="localePath('/auth/login')"
      :label="$t('auth.login.title')"
      color="primary"
      variant="solid"
      class="font-semibold"
      trailing-icon="i-lucide-arrow-right"
    />

    <UDropdownMenu
      v-else
      :items="menuItems"
      :ui="{
        content: '',
      }"
    >
      <UAvatar
        :alt="user?.name || user?.email || 'User'"
        :src="user?.image || undefined"
        :text="getUserInitials(user)"
        size="sm"
        role="button"
        :aria-label="t('auth.userMenu')"
        class="hover:ring-primary cursor-pointer ring-2 ring-neutral-200 transition-colors dark:ring-neutral-700"
      />
    </UDropdownMenu>
  </div>
</template>
