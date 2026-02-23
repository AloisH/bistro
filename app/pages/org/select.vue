<script setup lang="ts">
import type { Organization } from '../../../prisma/generated/client';

const localePath = useLocalePath();
const router = useRouter();

const {
  data: organizations,
  pending,
  error,
  refresh,
} = await useFetch<{ organizations: Organization[] }>('/api/organizations');

function selectOrg(slug: string) {
  router.push(localePath(`/org/${slug}/dashboard`));
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <UCard class="w-full max-w-2xl">
      <template #header>
        <h1 class="text-2xl font-bold">
          {{ $t('org.select.title') }}
        </h1>
        <p class="text-sm text-neutral-500 dark:text-neutral-400">
          {{ $t('org.select.description') }}
        </p>
      </template>

      <OrganizationSelectionList
        :organizations="organizations?.organizations ?? []"
        :pending="pending"
        :error="error"
        @select="selectOrg"
        @retry="refresh"
      />

      <template
        v-if="organizations?.organizations?.length"
        #footer
      >
        <UButton
          :to="localePath('/org/create')"
          variant="soft"
          icon="i-lucide-plus"
          block
        >
          {{ $t('org.select.createNew') }}
        </UButton>
      </template>
    </UCard>
  </div>
</template>
