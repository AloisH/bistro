<script setup lang="ts">
const { organizations, currentOrganization, currentOrgSlug, switchOrganization, fetchOrganizations } =
  useOrganization();

// Fetch orgs on mount
onMounted(() => fetchOrganizations());

const items = computed(() => [
  [
    {
      label: 'Members',
      icon: 'i-lucide-users',
      to: `/org/${currentOrgSlug.value}/members`,
    },
    {
      label: 'Settings',
      icon: 'i-lucide-settings',
      to: `/org/${currentOrgSlug.value}/settings`,
    },
  ],
  [
    ...organizations.value.map(org => ({
      label: org.name,
      avatar: { text: org.name.charAt(0).toUpperCase() },
      trailingIcon: org.slug === currentOrgSlug.value ? 'i-lucide-check' : undefined,
      click: () => switchOrganization(org.slug),
    })),
  ],
  [
    {
      label: 'Create Organization',
      icon: 'i-lucide-plus',
      to: '/organizations/create',
    },
  ],
]);
</script>

<template>
  <ClientOnly>
    <UDropdownMenu
      v-if="currentOrganization"
      :items="items"
      :ui="{
        content: 'shadow-strong backdrop-blur-sm',
      }"
    >
      <UButton
        color="neutral"
        variant="ghost"
        trailing-icon="i-lucide-chevron-down"
        block
        class="group hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200 hover:shadow-md"
      >
        <div class="flex items-center gap-2">
          <UAvatar
            :text="currentOrganization.name.charAt(0).toUpperCase()"
            size="xs"
            class="ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-primary transition-all"
          />
          <span class="font-semibold">{{ currentOrganization.name }}</span>
        </div>
      </UButton>
    </UDropdownMenu>
  </ClientOnly>
</template>
