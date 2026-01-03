<template>
  <UDashboardGroup>
    <!-- Left sidebar -->
    <UDashboardSidebar collapsible>
      <template #header="{ collapsed }">
        <UDashboardSidebarToggle />
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
            v-if="status === 'success' && navigation.length"
            :items="navigation"
            orientation="vertical"
          />
          <div
            v-else-if="status === 'pending'"
            class="p-4 text-sm text-gray-500"
          >
            Loading...
          </div>
          <div
            v-else-if="status === 'error'"
            class="p-4 text-sm text-red-500"
          >
            Error loading navigation
          </div>
          <div
            v-else
            class="p-4 text-sm text-gray-500"
          >
            No navigation items
          </div>
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
            <DocsSearch />
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
const { navigation, status } = useDocsNavigation();
</script>
