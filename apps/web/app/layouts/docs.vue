<template>
  <UDashboardGroup>
    <!-- Left sidebar -->
    <UDashboardSidebar collapsible>
      <template #header="{ collapsed }">
        <UDashboardNavbarToggle />
        <NuxtLink
          v-if="!collapsed"
          to="/"
          class="flex items-center gap-2 px-4 py-3"
        >
          <AppLogo class="h-5 w-auto shrink-0" />
        </NuxtLink>
        <div
          v-else
          class="flex items-center justify-center py-3"
        >
          <UIcon
            name="i-simple-icons-nuxtdotjs"
            class="text-primary size-5"
          />
        </div>
      </template>

      <!-- Navigation -->
      <template #default>
        <ClientOnly>
          <UNavigationMenu
            :items="docsNavItems"
            orientation="vertical"
          />
        </ClientOnly>
      </template>
    </UDashboardSidebar>

    <!-- Main content - DIRECT CHILD -->
    <UDashboardPanel>
      <template #header>
        <!-- Navbar (full width, managed by UDashboardPanel) -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UButton
              to="/"
              variant="ghost"
              size="sm"
            >
              Home
            </UButton>
            <UButton
              to="/blog"
              variant="ghost"
              size="sm"
            >
              Blog
            </UButton>
            <UButton
              to="/docs"
              variant="ghost"
              color="primary"
              size="sm"
            >
              Docs
            </UButton>
          </div>
          <div class="flex items-center gap-2">
            <UColorModeButton />
            <AuthButton />
          </div>
        </div>
      </template>

      <!-- Page content (scrollable) -->
      <slot />
    </UDashboardPanel>
  </UDashboardGroup>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const docsNavItems: NavigationMenuItem[][] = [
  [
    {
      label: 'Getting Started',
      icon: 'i-lucide-rocket',
      children: [
        { label: 'Installation', to: '/docs/getting-started/installation' },
        { label: 'Configuration', to: '/docs/getting-started/configuration' },
      ],
    },
    {
      label: 'Features',
      icon: 'i-lucide-star',
      children: [
        { label: 'Authentication', to: '/docs/features/authentication' },
        { label: 'Database', to: '/docs/features/database' },
      ],
    },
  ],
];
</script>
