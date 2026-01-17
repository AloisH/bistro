<script setup lang="ts">
const { query, results, isOpen, open } = useDocsSearch();

onMounted(() => {
  const handler = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      open();
    }
  };
  window.addEventListener('keydown', handler);
  onUnmounted(() => window.removeEventListener('keydown', handler));
});
</script>

<template>
  <div>
    <UButton
      variant="ghost"
      icon="i-lucide-search"
      size="sm"
      @click="open"
    >
      Search
      <template #trailing>
        <UKbd>⌘K</UKbd>
      </template>
    </UButton>

    <UModal
      v-model:open="isOpen"
      :ui="{ wrapper: 'max-w-2xl' }"
    >
      <template #content="{ close: closeModal }">
        <div class="p-4">
          <UInput
            v-model="query"
            placeholder="Search docs..."
            autofocus
            icon="i-lucide-search"
            size="lg"
          />

          <div
            v-if="results.length"
            class="mt-4 space-y-2 max-h-96 overflow-y-auto"
          >
            <NuxtLink
              v-for="r in results"
              :key="r.path"
              :to="r.path"
              class="block p-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
              @click="closeModal"
            >
              <div class="font-medium">
                {{ r.title }}
              </div>
              <div class="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mt-1">
                {{ r.content }}
              </div>
            </NuxtLink>
          </div>

          <div
            v-else-if="query"
            class="mt-8 text-center text-neutral-500"
          >
            No results
          </div>
          <div
            v-else
            class="mt-8 text-center text-neutral-500"
          >
            Start typing to search
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>
