<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
});

const route = useRoute();
const slug = route.params.slug as string;
</script>

<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Members">
        <template #right>
          <UColorModeButton />
        </template>
      </UDashboardNavbar>
    </template>

    <UCard>
      <template #header>
        <h1 class="text-3xl font-bold">
          Organization Members
        </h1>
      </template>

      <div class="space-y-6">
        <OrganizationMembers :organization-slug="slug" />
      </div>
    </UCard>
  </UDashboardPanel>
</template>
