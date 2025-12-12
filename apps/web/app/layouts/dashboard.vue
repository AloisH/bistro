<template>
  <div class="flex min-h-svh">
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
      </template>

      <template #footer="{ collapsed }">
        <div class="w-full">
          <UButton
            v-if="!collapsed"
            :avatar="{
              src: session?.user?.image || 'https://github.com/benjamincanac.png',
            }"
            :label="session?.user?.name || session?.user?.email || 'User'"
            color="neutral"
            variant="ghost"
            class="w-full justify-start"
            :to="'/profile'"
          />

          <div
            v-else
            class="flex flex-col items-center gap-2 p-2"
          >
            <UAvatar
              :src="session?.user?.image || 'https://github.com/benjamincanac.png'"
              size="md"
              class="shrink-0"
            />
            <UTooltip
              text="Logout"
              :shortcuts="['⌘', 'L']"
            >
              <UButton
                icon="i-lucide-log-out"
                color="neutral"
                variant="ghost"
                size="sm"
                @click="handleLogout"
              />
            </UTooltip>
          </div>

          <UButton
            v-if="!collapsed"
            label="Logout"
            icon="i-lucide-log-out"
            color="neutral"
            variant="ghost"
            class="w-full mt-2 justify-start"
            :square="false"
            @click="handleLogout"
          />
        </div>
      </template>
    </UDashboardSidebar>

    <div class="flex flex-1 flex-col min-h-svh">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';

const { session, signOut } = useAuth();
const router = useRouter();

const navigationItems: NavigationMenuItem[][] = [[{
  label: 'Dashboard',
  icon: 'i-lucide-house',
  to: '/dashboard',
  active: true,
}, {
  label: 'Profile',
  icon: 'i-lucide-user',
  to: '/profile',
}, {
  label: 'Settings',
  icon: 'i-lucide-settings',
  to: '/dashboard/settings',
}]];

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
