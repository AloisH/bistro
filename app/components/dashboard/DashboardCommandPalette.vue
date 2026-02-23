<script setup lang="ts">
import type { CommandPaletteGroup, CommandPaletteItem } from '@nuxt/ui';

const isOpen = defineModel<boolean>('open', { default: false });

const { t } = useI18n();
const localePath = useLocalePath();
const router = useRouter();
const auth = useAuth();
const { isAdmin } = useRole();
const { activeOrgSlug } = useOrganization();
const colorMode = useColorMode();
const { recentItems, addRecentItem } = useRecentItems();

// Navigation helper
function navigateToPath(path: string) {
  isOpen.value = false;
  void router.push(localePath(path));
}

// Logout handler
function handleLogout() {
  isOpen.value = false;
  void auth.signOut({ redirectTo: localePath('/auth/login') });
}

// Theme toggle
function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
  isOpen.value = false;
}

// Track selection for recent items
function handleSelect(item: CommandPaletteItem | undefined) {
  if (item && item.id) {
    addRecentItem({
      id: item.id as string,
      label: item.label as string,
      icon: item.icon as string | undefined,
    });
  }
}

// Navigation items
const navItems = computed<CommandPaletteItem[]>(() => [
  {
    id: 'nav-dashboard',
    label: t('dashboard.commandPalette.dashboard'),
    icon: 'i-lucide-house',
    onSelect: () => { navigateToPath(activeOrgSlug.value ? `/org/${activeOrgSlug.value}/dashboard` : '/org/select'); },
  },
  {
    id: 'nav-profile',
    label: t('dashboard.commandPalette.profile'),
    icon: 'i-lucide-user',
    onSelect: () => { navigateToPath('/profile'); },
  },
]);

// Organization items
const orgItems = computed<CommandPaletteItem[]>(() =>
  activeOrgSlug.value
    ? [
        {
          id: 'org-members',
          label: t('dashboard.commandPalette.members'),
          icon: 'i-lucide-users',
          onSelect: () => { navigateToPath(`/org/${activeOrgSlug.value}/members`); },
        },
        {
          id: 'org-settings',
          label: t('dashboard.commandPalette.settings'),
          icon: 'i-lucide-settings',
          onSelect: () => { navigateToPath(`/org/${activeOrgSlug.value}/settings`); },
        },
      ]
    : [],
);

// Admin items
const adminItems = computed<CommandPaletteItem[]>(() => [
  {
    id: 'admin-panel',
    label: t('dashboard.commandPalette.adminPanel'),
    icon: 'i-lucide-shield',
    onSelect: () => { navigateToPath('/admin/users'); },
  },
  {
    id: 'admin-email',
    label: t('dashboard.commandPalette.emailPreviews'),
    icon: 'i-lucide-mail',
    onSelect: () => { navigateToPath('/admin/email-preview'); },
  },
]);

// Action items
const actionItems = computed<CommandPaletteItem[]>(() => [
  {
    id: 'action-theme',
    label: colorMode.value === 'dark' ? t('dashboard.commandPalette.switchToLight') : t('dashboard.commandPalette.switchToDark'),
    icon: colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon',
    onSelect: toggleTheme,
  },
  {
    id: 'action-logout',
    label: t('dashboard.commandPalette.logout'),
    icon: 'i-lucide-log-out',
    onSelect: handleLogout,
  },
]);

// Build groups based on permissions
const groups = computed<CommandPaletteGroup[]>(() => {
  const result: CommandPaletteGroup[] = [];

  // Recent items (if any)
  if (recentItems.value.length > 0) {
    result.push({
      id: 'recent',
      label: t('dashboard.commandPalette.recent'),
      items: recentItems.value.map(item => ({
        id: item.id,
        label: item.label,
        icon: item.icon || 'i-lucide-clock',
        onSelect: (e: Event) => {
          // Find and execute the original action
          const allItems = [
            ...navItems.value,
            ...orgItems.value,
            ...adminItems.value,
            ...actionItems.value,
          ];
          const original = allItems.find(i => i.id === item.id);
          original?.onSelect?.(e);
        },
      })),
    });
  }

  // Always visible - Navigation
  result.push({
    id: 'navigation',
    label: t('dashboard.commandPalette.navigation'),
    items: navItems.value,
  });

  // Org pages - show when org is active
  if (activeOrgSlug.value && orgItems.value.length > 0) {
    result.push({
      id: 'organization',
      label: t('dashboard.commandPalette.organization'),
      items: orgItems.value,
    });
  }

  // Admin only
  if (isAdmin.value) {
    result.push({
      id: 'admin',
      label: t('dashboard.commandPalette.admin'),
      items: adminItems.value,
    });
  }

  // Actions - always visible
  result.push({
    id: 'actions',
    label: t('dashboard.commandPalette.actions'),
    items: actionItems.value,
  });

  return result;
});
</script>

<template>
  <UModal v-model:open="isOpen">
    <template #content>
      <UCommandPalette
        :groups="groups"
        :placeholder="$t('dashboard.commandPalette.search')"
        close
        @update:open="isOpen = $event"
        @update:model-value="handleSelect"
      />
    </template>
  </UModal>
</template>
