<template>
  <UAlert
    v-if="isImpersonating"
    color="warning"
    class="fixed top-0 left-0 right-0 z-50 rounded-none border-b"
    icon="i-lucide-alert-triangle"
  >
    <template #title>
      Viewing as {{ impersonatedUser?.name || impersonatedUser?.email || 'User' }}
    </template>
    <template #description>
      You are currently impersonating this user. Some actions may be restricted.
    </template>
    <template #actions>
      <UButton
        color="warning"
        variant="soft"
        :loading="loading"
        @click="handleStopImpersonation"
      >
        Stop Impersonating
      </UButton>
    </template>
  </UAlert>
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
