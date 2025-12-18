<script setup lang="ts">
import type { Organization } from '~/prisma/generated/client';

const router = useRouter();

const { data: organizations, pending, error, refresh } = await useFetch<{ organizations: Organization[] }>('/api/organizations');

async function selectOrg(slug: string) {
  await router.push(`/org/${slug}/dashboard`);
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <UCard class="w-full max-w-2xl">
      <template #header>
        <h1 class="text-2xl font-bold">
          Select Organization
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Choose an organization to continue
        </p>
      </template>

      <div
        v-if="pending"
        class="py-8 text-center"
      >
        <p class="text-gray-500">Loading organizations...</p>
      </div>

      <div
        v-else-if="error"
        class="py-8"
      >
        <UAlert
          color="error"
          icon="i-lucide-alert-triangle"
          title="Error loading organizations"
          :description="error.message"
        />
        <UButton
          class="mt-4"
          @click="refresh"
        >
          Retry
        </UButton>
      </div>

      <div
        v-else-if="organizations?.organizations?.length === 0"
        class="py-12 text-center"
      >
        <div class="mb-4">
          <UIcon
            name="i-lucide-building-2"
            class="h-12 w-12 text-gray-400"
          />
        </div>
        <h2 class="mb-2 text-lg font-semibold">
          No organizations yet
        </h2>
        <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Create your first organization to get started
        </p>
        <UButton
          to="/organizations/create"
          icon="i-lucide-plus"
        >
          Create Organization
        </UButton>
      </div>

      <div
        v-else
        class="space-y-2"
      >
        <UButton
          v-for="org in organizations?.organizations"
          :key="org.id"
          variant="ghost"
          class="w-full justify-start"
          @click="selectOrg(org.slug)"
        >
          <div class="flex items-center gap-3">
            <UIcon
              name="i-lucide-building-2"
              class="h-5 w-5"
            />
            <div class="text-left">
              <div class="font-medium">
                {{ org.name }}
              </div>
              <div
                v-if="org.description"
                class="text-xs text-gray-500"
              >
                {{ org.description }}
              </div>
            </div>
          </div>
        </UButton>
      </div>

      <template
        v-if="organizations?.organizations?.length"
        #footer
      >
        <UButton
          to="/organizations/create"
          variant="soft"
          icon="i-lucide-plus"
          block
        >
          Create New Organization
        </UButton>
      </template>
    </UCard>
  </div>
</template>
