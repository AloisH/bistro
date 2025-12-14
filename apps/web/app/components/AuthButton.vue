<template>
  <div v-if="!isPending">
    <UButton
      v-if="!session"
      to="/auth/login"
      label="Login"
      color="neutral"
      variant="subtle"
    />

    <UDropdownMenu
      v-else
      :items="menuItems"
      @select="onMenuSelect"
    >
      <UAvatar
        :alt="user?.name || user?.email || 'User'"
        :src="user?.image"
        :text="getUserInitials(user)"
        size="sm"
      />
    </UDropdownMenu>
  </div>
</template>

<script setup lang="ts">
const { session, user, isPending, client } = useAuth();
const { isSuperAdmin } = useRole();

// Helper function to get user initials
function getUserInitials(user: { name?: string; email?: string } | null | undefined): string {
  if (!user) return 'U';

  const name = user.name || user.email || '';
  if (!name) return 'U';

  // Extract first letters of each word for names
  if (name.includes(' ')) {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  }

  // For single names or emails, use first letter
  return name.charAt(0).toUpperCase();
}

async function handleLogout() {
  await client.signOut();
  await navigateTo('/');
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
        label: 'Dashboard',
        icon: 'i-lucide-layout-dashboard',
        to: '/dashboard',
      },
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
      id: 'logout',
    } as unknown as { label: string; icon: string },
  ]);

  return items;
});

// Handle menu item selection
function onMenuSelect(item: { id?: string }) {
  if (item.id === 'logout') {
    handleLogout();
  }
}
</script>
