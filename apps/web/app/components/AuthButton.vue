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
            label: session.user?.email || '',
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
        :alt="session.user?.name || session.user?.email || 'User'"
        :src="session.user?.image"
        size="sm"
      />
    </UDropdownMenu>
  </div>
</template>

<script setup lang="ts">
const { session, isPending, client } = useAuth();

async function handleLogout() {
  await client.signOut();
  await navigateTo('/');
}
</script>
