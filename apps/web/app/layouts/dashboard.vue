<template>
  <UApp>
    <UDashboardGroup>
      <UDashboardSidebar
        resizable
        collapsible
        :ui="{
          footer: 'border-t border-default',
        }"
        class="bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800"
      >
        <template #header="{ collapsed }">
          <div
            v-if="!collapsed"
            class="flex w-full items-center justify-between gap-2"
          >
            <OrganizationSwitcher
              v-if="orgSlug"
              class="min-w-0 flex-1"
            />
            <AppLogo
              v-else
              class="h-5 w-auto shrink-0"
            />
            <UDashboardSidebarCollapse />
          </div>
          <UDashboardSidebarCollapse
            v-else
            class="mx-auto"
          />
        </template>

        <template #default="{ collapsed }">
          <UButton
            :label="collapsed ? undefined : 'Search...'"
            :aria-label="collapsed ? 'Search' : undefined"
            icon="i-lucide-search"
            color="neutral"
            variant="outline"
            block
            :square="collapsed"
            class="group"
          >
            <template
              v-if="!collapsed"
              #trailing
            >
              <div class="ms-auto flex items-center gap-0.5">
                <UKbd
                  value="meta"
                  variant="subtle"
                  class=""
                />
                <UKbd
                  value="K"
                  variant="subtle"
                  class=""
                />
              </div>
            </template>
          </UButton>

          <ClientOnly>
            <UNavigationMenu
              :collapsed="collapsed"
              :items="navigationItems"
              orientation="vertical"
              :ui="{
                link: 'hover:bg-neutral-100 dark:hover:bg-neutral-800',
              }"
            />

            <UNavigationMenu
              :collapsed="collapsed"
              :items="footerItems"
              orientation="vertical"
              class="mt-auto"
              :ui="{
                link: 'hover:bg-neutral-100 dark:hover:bg-neutral-800',
              }"
            />
          </ClientOnly>
        </template>

        <template #footer="{ collapsed }">
          <ClientOnly>
            <UDropdownMenu
              :items="userMenuItems"
              :ui="{
                content: 'w-(--reka-dropdown-menu-trigger-width)',
              }"
            >
              <UButton
                v-if="!collapsed"
                color="neutral"
                variant="ghost"
                block
                class="group hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <div class="flex w-full items-center justify-between gap-2">
                  <div class="flex min-w-0 items-center gap-2">
                    <UAvatar
                      :src="user?.image || undefined"
                      :alt="user?.name || user?.email || 'User'"
                      :text="getUserInitials(user)"
                      size="xs"
                      class="ring-2 ring-neutral-200 dark:ring-neutral-700 group-hover:ring-primary transition-all"
                    />
                    <span class="truncate text-sm font-medium">{{
                      user?.name || user?.email || 'User'
                    }}</span>
                  </div>
                  <UIcon
                    name="i-lucide-chevron-up"
                    class="size-4 shrink-0 transition-transform group-hover:-translate-y-0.5"
                  />
                </div>
              </UButton>

              <UAvatar
                v-else
                :src="user?.image || undefined"
                :alt="user?.name || user?.email || 'User'"
                :text="getUserInitials(user)"
                size="md"
                role="button"
                aria-label="User menu"
                class="cursor-pointer ring-2 ring-neutral-200 dark:ring-neutral-700 hover:ring-primary transition-colors"
              />
            </UDropdownMenu>
          </ClientOnly>
        </template>
      </UDashboardSidebar>

      <slot />
    </UDashboardGroup>
  </UApp>
</template>

<script setup lang="ts">
import type { NavigationMenuItem, DropdownMenuItem } from '@nuxt/ui';

const { user, signOut } = useAuth();
const { isAdmin } = useRole();
const router = useRouter();
const route = useRoute();

// Detect if on org page and extract slug
const orgSlug = computed(() => {
  const match = route.path.match(/^\/org\/([^/]+)/);
  return match ? match[1] : null;
});

const navigationItems = computed<NavigationMenuItem[][]>(() => {
  // If on org page, show org-scoped navigation
  if (orgSlug.value) {
    return [
      [
        {
          label: 'Dashboard',
          icon: 'i-lucide-house',
          to: `/org/${orgSlug.value}/dashboard`,
        },
      ],
    ];
  }

  // User-level navigation
  const baseItems: NavigationMenuItem[] = [
    {
      label: 'Profile',
      icon: 'i-lucide-user',
      to: '/profile',
    },
  ];

  const adminItems: NavigationMenuItem[] = isAdmin.value
    ? [
        {
          label: 'Admin',
          icon: 'i-lucide-shield',
          to: '/admin/users',
        },
        {
          label: 'Email Previews',
          icon: 'i-lucide-mail',
          to: '/admin/email-preview',
        },
      ]
    : [];

  return [[...baseItems, ...adminItems]];
});

const footerItems: NavigationMenuItem[][] = [
  [
    {
      label: 'Feedback',
      icon: 'i-lucide-message-circle',
      to: 'https://github.com/aloish/bistro',
      target: '_blank',
    },
    {
      label: 'Help & Support',
      icon: 'i-lucide-info',
      to: 'https://github.com/nuxt/ui',
      target: '_blank',
    },
  ],
];

const userMenuItems = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: 'Profile',
      icon: 'i-lucide-user',
      to: '/profile',
    },
  ],
  [
    {
      label: 'Logout',
      icon: 'i-lucide-log-out',
      click: handleLogout,
    },
  ],
]);

async function handleLogout() {
  await signOut();
  await router.push('/auth/login');
}
</script>
