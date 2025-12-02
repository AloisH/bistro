<template>
  <div class="container mx-auto p-8">
    <UCard>
      <template #header>
        <h1 class="text-3xl font-bold">Dashboard</h1>
      </template>

      <div class="space-y-6">
        <div>
          <h2 class="text-xl font-semibold mb-2">Welcome, {{ session?.user?.name || 'User' }}!</h2>
          <p class="text-gray-600 dark:text-gray-400">
            You're successfully logged in.
          </p>
        </div>

        <div class="border-t pt-6 dark:border-gray-700">
          <h3 class="font-semibold mb-4">Session Info</h3>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">User ID:</span>
              <span class="font-mono">{{ session?.user?.id }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Email:</span>
              <span>{{ session?.user?.email }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600 dark:text-gray-400">Session expires:</span>
              <span>{{ sessionExpiry }}</span>
            </div>
          </div>
        </div>

        <div class="border-t pt-6 dark:border-gray-700">
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            More features coming soon...
          </p>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const { session } = useAuth()

const sessionExpiry = computed(() => {
  if (!session.value?.expiresAt) return 'N/A'
  return new Date(session.value.expiresAt).toLocaleString()
})
</script>
