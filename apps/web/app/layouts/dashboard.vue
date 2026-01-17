<template>
  <UDashboardGroup>
    <UDashboardSidebar
      resizable
      collapsible
      :ui="{
        footer: 'border-t border-default',
      }"
      class="bg-default border-r border-default"
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
            :ui="{
              content: 'w-(--reka-dropdown-menu-trigger-width)',
            }"
          >
            <UUser
              v-if="!collapsed"
              :name="user?.name || user?.email || 'User'"
              :avatar="{ src: user?.image || undefined, text: getUserInitials(user) }"
              class="w-full cursor-pointer rounded-md p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            />

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

    <div class="flex flex-1 flex-col overflow-hidden">
      <UDashboardNavbar
        title="Bistro"
        :toggle="{ icon: 'i-lucide-menu' }"
        class="lg:hidden"
      >
        <template #right>
          <UColorModeButton />
        </template>
      </UDashboardNavbar>

      <slot />
    </div>
  </UDashboardGroup>
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
