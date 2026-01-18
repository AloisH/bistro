<template>
  <UModal v-model:open="isOpen">
    <template #content>
      <UCommandPalette
        :groups="groups"
        placeholder="Search..."
        close
        @update:open="isOpen = $event"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { CommandPaletteItem, CommandPaletteGroup } from '@nuxt/ui';

const isOpen = defineModel<boolean>('open', { default: false });

const router = useRouter();
const { signOut } = useAuth();
const { isAdmin } = useRole();
const { activeOrgSlug } = useOrganization();

// Keyboard shortcut
defineShortcuts({
  meta_k: () => {
    isOpen.value = true;
  },
});

// Navigation helper
function navigateTo(path: string) {
  isOpen.value = false;
  router.push(path);
}

// Logout handler
function handleLogout() {
  isOpen.value = false;
  signOut({ redirectTo: '/auth/login' });
}

// Build groups based on permissions
const groups = computed<CommandPaletteGroup[]>(() => {
  const result: CommandPaletteGroup[] = [];

  // Always visible - Navigation
  const navItems: CommandPaletteItem[] = [
    {
      label: 'Dashboard',
      icon: 'i-lucide-house',
      onSelect: () => navigateTo(activeOrgSlug.value ? `/org/${activeOrgSlug.value}/dashboard` : '/organizations/select'),
    },
    {
      label: 'Profile',
      icon: 'i-lucide-user',
      onSelect: () => navigateTo('/profile'),
    },
  ];

  result.push({
    id: 'navigation',
    label: 'Navigation',
    items: navItems,
  });

  // Org pages - show when org is active (pages handle auth)
  if (activeOrgSlug.value) {
    result.push({
      id: 'organization',
      label: 'Organization',
      items: [
        {
          label: 'Members',
          icon: 'i-lucide-users',
          onSelect: () => navigateTo(`/org/${activeOrgSlug.value}/members`),
        },
        {
          label: 'Settings',
          icon: 'i-lucide-settings',
          onSelect: () => navigateTo(`/org/${activeOrgSlug.value}/settings`),
        },
      ],
    });
  }

  // Admin only
  if (isAdmin.value) {
    result.push({
      id: 'admin',
      label: 'Admin',
      items: [
        {
          label: 'Admin Panel',
          icon: 'i-lucide-shield',
          onSelect: () => navigateTo('/admin/users'),
        },
        {
          label: 'Email Previews',
          icon: 'i-lucide-mail',
          onSelect: () => navigateTo('/admin/email-preview'),
        },
      ],
    });
  }

  // Actions - always visible
  result.push({
    id: 'actions',
    label: 'Actions',
    items: [
      {
        label: 'Logout',
        icon: 'i-lucide-log-out',
        onSelect: handleLogout,
      },
    ],
  });

  return result;
});
</script>
