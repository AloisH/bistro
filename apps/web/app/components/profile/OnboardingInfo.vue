<template>
  <div class="border-b border-gray-200 pb-6 dark:border-gray-700">
    <div class="mb-6">
      <h2 class="text-lg font-semibold text-gray-900 sm:text-xl dark:text-white">
        Onboarding Information
      </h2>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Information collected during your initial setup
      </p>
    </div>

    <div class="space-y-4">
      <div class="grid gap-4 sm:grid-cols-2">
        <!-- Bio -->
        <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <div class="flex items-start gap-3">
            <UIcon
              name="i-lucide-user"
              class="text-primary mt-0.5 h-5 w-5 shrink-0"
            />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Bio
              </p>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">
                {{ (user as any)?.bio || 'Not provided' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Company -->
        <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <div class="flex items-start gap-3">
            <UIcon
              name="i-lucide-briefcase"
              class="text-primary mt-0.5 h-5 w-5 shrink-0"
            />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Company
              </p>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">
                {{ (user as any)?.company || 'Not provided' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Use Case -->
        <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <div class="flex items-start gap-3">
            <UIcon
              name="i-lucide-target"
              class="text-primary mt-0.5 h-5 w-5 shrink-0"
            />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Use Case
              </p>
              <p class="mt-1 text-sm capitalize text-gray-900 dark:text-white">
                {{ (user as any)?.useCase || 'Not provided' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Email Notifications -->
        <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <div class="flex items-start gap-3">
            <UIcon
              name="i-lucide-mail"
              class="text-primary mt-0.5 h-5 w-5 shrink-0"
            />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Notifications
              </p>
              <p class="mt-1 text-sm text-gray-900 dark:text-white">
                {{ (user as any)?.emailNotifications ? 'Enabled' : 'Disabled' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user } = useAuth();
</script>
