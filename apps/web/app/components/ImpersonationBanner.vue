<template>
  <div
    v-if="isImpersonating"
    class="fixed top-0 left-0 right-0 z-50 bg-warning-100 dark:bg-warning-950 border-b border-warning-200 dark:border-warning-800 px-4 py-3"
  >
    <div class="flex items-center justify-between gap-4 max-w-screen-2xl mx-auto">
      <div class="flex items-center gap-3 min-w-0">
        <UIcon
          name="i-lucide-alert-triangle"
          class="size-5 text-warning-600 dark:text-warning-400 shrink-0"
        />
        <div class="min-w-0">
          <p class="font-medium text-warning-900 dark:text-warning-100 truncate">
            Viewing as {{ impersonatedUser?.name || impersonatedUser?.email || 'User' }}
          </p>
          <p class="text-sm text-warning-700 dark:text-warning-300">
            Some actions may be restricted
          </p>
        </div>
      </div>
      <UButton
        color="warning"
        variant="solid"
        size="sm"
        :loading="loading"
        class="shrink-0"
        @click="handleStopImpersonation"
      >
        Stop
      </UButton>
    </div>
  </div>
  <div
    v-if="isImpersonating"
    class="h-[73px]"
  />
</template>

<script setup lang="ts">
const { isImpersonating, impersonatedUser, stopImpersonation, checkImpersonation } = useImpersonation();
const loading = ref(false);
const toast = useToast();

// Check impersonation status on mount
onMounted(async () => {
  await checkImpersonation();
});

async function handleStopImpersonation() {
  loading.value = true;
  const result = await stopImpersonation();
  loading.value = false;

  if (result.success) {
    toast.add({
      title: 'Stopped impersonation',
      description: 'Returned to your admin account',
      color: 'success',
      icon: 'i-lucide-check',
    });
    await navigateTo('/admin/users');
  } else {
    toast.add({
      title: 'Error',
      description: result.error || 'Failed to stop impersonation',
      color: 'error',
      icon: 'i-lucide-alert-triangle',
    });
  }
}
</script>
