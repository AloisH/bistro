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
      :items="[
        [
          {
            label: user?.email || '',
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
        [
          {
            label: 'Logout',
            icon: 'i-lucide-log-out',
            onSelect: handleLogout,
          },
        ],
      ]"
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
</script>
