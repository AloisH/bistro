<template>
  <UDashboardGroup>
    <!-- Left sidebar -->
    <UDashboardSidebar
      collapsible
      class="bg-default border-r border-default"
    >
      <template #header="{ collapsed }">
        <div
          v-if="!collapsed"
          class="flex w-full items-center justify-between gap-2"
        >
          <NuxtLink
            to="/"
            class="flex items-center gap-2"
          >
            <UIcon
              name="i-lucide-check-square"
              class="size-5 text-primary"
            />
            <span class="font-semibold">Bistro</span>
          </NuxtLink>
          <UDashboardSidebarCollapse />
        </div>
        <UDashboardSidebarCollapse
          v-else
          class="mx-auto"
        />
      </template>

      <!-- Navigation -->
      <template #default="{ collapsed }">
        <DocsSearch v-if="!collapsed" />

        <ClientOnly>
          <UNavigationMenu
            v-if="status === 'success' && navigation.length"
            :collapsed="collapsed"
            :items="navigation"
            orientation="vertical"
          />
          <div
            v-else-if="status === 'pending'"
            class="space-y-2 p-4"
          >
            <USkeleton
              v-for="i in 5"
              :key="i"
              class="h-8 w-full"
            />
          </div>
          <div
            v-else-if="status === 'error'"
            class="p-4 text-sm text-red-500"
          >
            Error loading navigation
          </div>
          <div
            v-else
            class="p-4 text-sm text-neutral-500"
          >
            No navigation items
          </div>
        </ClientOnly>
      </template>
    </UDashboardSidebar>

    <!-- Main content -->
    <UDashboardPanel class="flex flex-col h-screen w-full">
      <UDashboardNavbar>
        <template #left>
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
        </template>

        <template #right>
          <UColorModeButton />
          <AuthButton />
        </template>
      </UDashboardNavbar>

      <!-- Scrollable content area -->
      <div class="flex-1 overflow-y-auto">
        <slot />
      </div>
    </UDashboardPanel>
  </UDashboardGroup>
</template>

<script setup lang="ts">
const { navigation, status } = useDocsNavigation();
</script>
