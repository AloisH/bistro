<script setup lang="ts">
import type { Organization } from '../../prisma/generated/client';

const route = useRoute();
const router = useRouter();

const currentSlug = computed(() => route.params.slug as string);

const { data: orgsData } = await useFetch<{ organizations: Organization[] }>('/api/organizations');

const organizations = computed(() => orgsData.value?.organizations || []);

const currentOrg = computed(() =>
  organizations.value.find(org => org.slug === currentSlug.value),
);

const items = computed(() => [
  [
    {
      label: 'Members',
      icon: 'i-lucide-users',
      to: `/org/${currentSlug.value}/members`,
    },
    {
      label: 'Settings',
      icon: 'i-lucide-settings',
      to: `/org/${currentSlug.value}/settings`,
    },
  ],
  [
    ...organizations.value.map(org => ({
      label: org.name,
      avatar: { text: org.name.charAt(0).toUpperCase() },
      trailingIcon: org.slug === currentSlug.value ? 'i-lucide-check' : undefined,
      click: () => switchOrg(org.slug),
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

async function switchOrg(slug: string) {
  if (slug !== currentSlug.value) {
    await router.push(`/org/${slug}/dashboard`);
  }
}
</script>

<template>
  <ClientOnly>
    <UDropdownMenu
      v-if="currentOrg"
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
            :text="currentOrg.name.charAt(0).toUpperCase()"
            size="xs"
            class="ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-primary transition-all"
          />
          <span class="font-semibold">{{ currentOrg.name }}</span>
        </div>
      </UButton>
    </UDropdownMenu>
  </ClientOnly>
</template>
