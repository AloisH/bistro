<template>
  <UDashboardGroup>
    <UDashboardSidebar
      resizable
      collapsible
      :ui="{
        footer: 'border-t border-default',
      }"
    >
      <template #header="{ collapsed }">
        <AppLogo
          v-if="!collapsed"
          class="h-5 w-auto shrink-0"
        />
        <UIcon
          v-else
          name="i-simple-icons-nuxtdotjs"
          class="size-5 text-primary mx-auto"
        />
      </template>

      <template #default="{ collapsed }">
        <UButton
          :label="collapsed ? undefined : 'Search...'"
          icon="i-lucide-search"
          color="neutral"
          variant="outline"
          block
          :square="collapsed"
        >
          <template
            v-if="!collapsed"
            #trailing
          >
            <div class="flex items-center gap-0.5 ms-auto">
              <UKbd
                value="meta"
                variant="subtle"
              />
              <UKbd
                value="K"
                variant="subtle"
              />
            </div>
          </template>
        </UButton>

        <ClientOnly>
          <UNavigationMenu
            :collapsed="collapsed"
            :items="navigationItems"
            orientation="vertical"
          />

          <UNavigationMenu
            :collapsed="collapsed"
            :items="footerItems"
            orientation="vertical"
            class="mt-auto"
          />
        </ClientOnly>
      </template>

      <template #footer="{ collapsed }">
        <ClientOnly>
          <UDropdownMenu
            :items="userMenuItems"
            :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width)' }"
          >
            <UButton
              v-if="!collapsed"
              color="neutral"
              variant="ghost"
              block
            >
              <div class="flex items-center justify-between w-full gap-2">
                <div class="flex items-center gap-2 min-w-0">
                  <UAvatar
                    :src="session?.user?.image || undefined"
                    :alt="session?.user?.name || session?.user?.email || 'User'"
                    :text="getUserInitials(session?.user)"
                    size="xs"
                  />
                  <span class="truncate text-sm">{{ session?.user?.name || session?.user?.email || 'User' }}</span>
                </div>
                <UIcon
                  name="i-lucide-chevron-up"
                  class="size-4 shrink-0"
                />
              </div>
            </UButton>

            <UAvatar
              v-else
              :src="session?.user?.image || undefined"
              :alt="session?.user?.name || session?.user?.email || 'User'"
              :text="getUserInitials(session?.user)"
              size="md"
              class="cursor-pointer"
            />
          </UDropdownMenu>
        </ClientOnly>
      </template>
    </UDashboardSidebar>

    <slot />
  </UDashboardGroup>
</template>

<script setup lang="ts">
import type { NavigationMenuItem, DropdownMenuItem } from '@nuxt/ui';

const { session, signOut } = useAuth();
const { isSuperAdmin } = useRole();
const router = useRouter();

const navigationItems = computed<NavigationMenuItem[][]>(() => {
  const baseItems: NavigationMenuItem[] = [{
    label: 'Dashboard',
    icon: 'i-lucide-house',
    to: '/dashboard',
  }, {
    label: 'Profile',
    icon: 'i-lucide-user',
    to: '/profile',
  }, {
    label: 'Settings',
    icon: 'i-lucide-settings',
    to: '/dashboard/settings',
  }];

  const adminItems: NavigationMenuItem[] = isSuperAdmin.value
    ? [{
        label: 'Admin',
        icon: 'i-lucide-shield',
        to: '/admin/users',
      }]
    : [];

  return [[...baseItems, ...adminItems]];
});

const footerItems: NavigationMenuItem[][] = [[{
  label: 'Feedback',
  icon: 'i-lucide-message-circle',
  to: 'https://github.com/aloish/bistro',
  target: '_blank',
}, {
  label: 'Help & Support',
  icon: 'i-lucide-info',
  to: 'https://github.com/nuxt/ui',
  target: '_blank',
}]];

const userMenuItems = computed<DropdownMenuItem[][]>(() => [
  [{
    label: 'Profile',
    icon: 'i-lucide-user',
    to: '/profile',
  }, {
    label: 'Settings',
    icon: 'i-lucide-settings',
    to: '/dashboard/settings',
  }],
  [{
    label: 'Logout',
    icon: 'i-lucide-log-out',
    click: handleLogout,
  }],
]);

function getUserInitials(user: { name?: string; email?: string } | null | undefined): string {
  if (!user) return 'U';

  const name = user.name || user.email || '';
  if (!name) return 'U';

  // For emails, use first letter
  if (name.includes('@')) {
    return name.charAt(0).toUpperCase();
  }

  // For multi-word names, use first letter of each word
  const words = name.trim().split(/\s+/);
  if (words.length > 1) {
    return words
      .slice(0, 2)
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  }

  // For single names, use first letter
  return name.charAt(0).toUpperCase();
}

async function handleLogout() {
  try {
    await signOut();
    await router.push('/auth/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
}

// Add keyboard shortcut for logout
defineShortcuts({
  'meta-l': handleLogout,
});
</script>
