<script setup lang="ts">
const { query, results, isOpen, selectedIndex, open, close, selectPrevious, selectNext, getSelectedResult } = useDocsSearch();

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

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    selectPrevious();
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    selectNext();
  } else if (e.key === 'Enter') {
    e.preventDefault();
    const result = getSelectedResult();
    if (result) {
      navigateTo(result.path);
      close();
    }
  }
}
</script>

<template>
  <div>
    <UButton variant="ghost" icon="i-lucide-search" size="sm" @click="open">
      Search
      <template #trailing>
        <UKbd>⌘K</UKbd>
      </template>
    </UButton>

    <UModal v-model:open="isOpen" :ui="{ wrapper: 'max-w-2xl' }">
      <template #content="{ close: closeModal }">
        <div class="p-4">
          <UInput
            v-model="query"
            placeholder="Search docs..."
            autofocus
            icon="i-lucide-search"
            size="lg"
            @keydown="handleKeydown"
          />

          <div v-if="results.length" class="mt-4 max-h-96 space-y-2 overflow-y-auto">
            <NuxtLink
              v-for="(r, i) in results"
              :key="r.path"
              :to="r.path"
              class="block rounded-lg p-3 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              :class="{ 'bg-neutral-100 dark:bg-neutral-800': i === selectedIndex }"
              @click="closeModal"
            >
              <div class="font-medium">
                {{ r.title }}
              </div>
              <div class="mt-1 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
                {{ r.content }}
              </div>
            </NuxtLink>
          </div>

          <div v-else-if="query" class="mt-8 text-center text-neutral-500">No results</div>
          <div v-else class="mt-8 text-center text-neutral-500">Start typing to search</div>
        </div>
      </template>
    </UModal>
  </div>
</template>
