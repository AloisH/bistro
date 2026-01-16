<template>
  <div />
</template>

<script setup lang="ts">
// Redirect to admin users page
definePageMeta({
  middleware: async () => {
    return navigateTo({ name: 'admin-users' });
  },
});
</script>
