<template>
  <div class="w-full p-8">
    <UCard>
      <template #header>
        <h1 class="text-3xl font-bold">Settings</h1>
      </template>

      <div class="space-y-6">
        <div>
          <h2 class="mb-2 text-xl font-semibold">Account Settings</h2>
          <p class="text-gray-600 dark:text-gray-400">Configure your account preferences</p>
        </div>

        <div class="border-t pt-6 dark:border-gray-700">
          <h3 class="mb-4 font-semibold">Theme Preferences</h3>
          <div class="flex items-center gap-4">
            <UButton
              icon="i-lucide-sun"
              color="neutral"
              variant="ghost"
              @click="() => $colorMode.preference = 'light'"
            >
              Light
            </UButton>
            <UButton
              icon="i-lucide-moon"
              color="neutral"
              variant="ghost"
              @click="() => $colorMode.preference = 'dark'"
            >
              Dark
            </UButton>
            <UButton
              icon="i-lucide-monitor"
              color="neutral"
              variant="ghost"
              @click="() => $colorMode.preference = 'system'"
            >
              System
            </UButton>
          </div>
        </div>

        <div class="border-t pt-6 dark:border-gray-700">
          <h3 class="mb-4 font-semibold">Current Theme</h3>
          <p class="text-sm">
            <UBadge
              :label="$colorMode.preference"
              variant="subtle"
            />
          </p>
        </div>

        <div class="border-t pt-6 dark:border-gray-700">
          <p class="text-sm text-gray-600 dark:text-gray-400">Additional settings coming soon...</p>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
});
</script>
