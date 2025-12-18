<script setup lang="ts">
import type { Organization } from '~/prisma/generated/client';

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
    ...organizations.value.map(org => ({
      label: org.name,
      icon: org.slug === currentSlug.value ? 'i-lucide-check' : 'i-lucide-building-2',
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
    >
      <UButton
        color="neutral"
        variant="ghost"
        trailing-icon="i-lucide-chevron-down"
        block
      >
        <div class="flex items-center gap-2">
          <UIcon
            name="i-lucide-building-2"
            class="h-4 w-4"
          />
          <span>{{ currentOrg.name }}</span>
        </div>
      </UButton>
    </UDropdownMenu>
  </ClientOnly>
</template>
