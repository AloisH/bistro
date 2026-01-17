<template>
  <div v-if="!isPending">
    <UButton
      v-if="!session"
      to="/auth/login"
      label="Login"
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
      @select="onMenuSelect"
    >
      <UAvatar
        :alt="user?.name || user?.email || 'User'"
        :src="user?.image || undefined"
        :text="getUserInitials(user)"
        size="sm"
        role="button"
        aria-label="User menu"
        class="cursor-pointer ring-2 ring-neutral-200 dark:ring-neutral-700 hover:ring-primary transition-colors"
      />
    </UDropdownMenu>
  </div>
</template>

<script setup lang="ts">
const { session, user, isPending, client } = useAuth();
const { isSuperAdmin } = useRole();

async function handleLogout() {
  await client.signOut();
  await navigateTo({ name: 'index' });
}

// Build menu items dynamically based on role
const menuItems = computed(() => {
  const items = [
    [
      {
        label: user.value?.email || '',
        icon: 'i-lucide-user',
        disabled: true,
      },
    ],
    [
      {
        label: 'Profile',
        icon: 'i-lucide-settings',
        to: '/profile',
      },
    ],
  ];

  // Add admin panel link if super admin
  if (isSuperAdmin.value) {
    items.push([
      {
        label: 'Admin Panel',
        icon: 'i-lucide-shield',
        to: '/admin/users',
      },
    ]);
  }

  // Add logout at the end
  items.push([
    {
      label: 'Logout',
      icon: 'i-lucide-log-out',
      disabled: false,
    },
  ]);

  return items;
});

// Handle menu item selection
function onMenuSelect(item: { label?: string }) {
  if (item.label === 'Logout') {
    handleLogout();
  }
}
</script>
