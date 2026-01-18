<template>
  <div class="container mx-auto px-4 py-12">
    <!-- Hero Section -->
    <div class="relative overflow-hidden bg-gradient-to-br from-primary-500/10 via-primary-600/5 to-transparent dark:from-primary-400/10 dark:via-primary-500/5 rounded-3xl p-12 mb-12">
      <div class="absolute top-0 right-0 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl -z-10" />
      <div class="absolute bottom-0 left-0 w-72 h-72 bg-green-500/10 rounded-full blur-3xl -z-10" />

      <div class="max-w-3xl">
        <h1 class="text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
          Changelog
        </h1>
        <p class="text-xl text-neutral-600 dark:text-neutral-400">
          Track new features, improvements, and bug fixes in Bistro.
        </p>
      </div>
    </div>

    <!-- Type filters -->
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-4">
        <UIcon
          name="i-lucide-filter"
          class="text-neutral-400"
        />
        <h2 class="text-lg font-semibold text-neutral-900 dark:text-white">
          Filter by type
        </h2>
      </div>

      <div class="flex gap-2 flex-wrap">
        <UBadge
          variant="subtle"
          :color="!selectedType ? 'primary' : 'neutral'"
          class="cursor-pointer"
          @click="filterByType('')"
        >
          All ({{ allEntries?.length || 0 }})
        </UBadge>
        <UBadge
          v-for="type in changeTypes"
          :key="type.value"
          variant="subtle"
          :color="selectedType === type.value ? 'primary' : 'neutral'"
          class="cursor-pointer"
          @click="filterByType(type.value)"
        >
          <UIcon
            :name="type.icon"
            class="size-3 mr-1"
          />
          {{ type.label }} ({{ countByType(type.value) }})
        </UBadge>
      </div>
    </div>

    <!-- Changelog timeline -->
    <UChangelogVersions v-if="entries?.length">
      <UChangelogVersion
        v-for="entry in entries"
        :key="entry.path"
        :title="entry.title"
        :description="entry.description"
        :date="entry.date"
        :badge="{ label: entry.version, color: getVersionColor(entry.type) }"
        :to="entry.path"
      >
        <template #body>
          <div
            v-if="entry.changes?.length"
            class="space-y-2 mt-4"
          >
            <div
              v-for="(change, idx) in entry.changes"
              :key="idx"
              class="flex items-start gap-2 text-sm"
            >
              <UIcon
                :name="getChangeIcon(change.type)"
                :class="getChangeColor(change.type)"
                class="size-4 mt-0.5 shrink-0"
              />
              <span class="text-neutral-600 dark:text-neutral-400">
                {{ change.description }}
              </span>
            </div>
          </div>
        </template>
      </UChangelogVersion>
    </UChangelogVersions>

    <!-- Empty state -->
    <div
      v-else
      class="text-center py-12"
    >
      <UIcon
        name="i-lucide-file-text"
        class="size-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4"
      />
      <p class="text-neutral-500">
        No changelog entries found.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ChangelogChange {
  type: 'feature' | 'fix' | 'improvement';
  description: string;
}

interface ChangelogEntry {
  path: string;
  title: string;
  description: string;
  date: string;
  version: string;
  type: 'major' | 'minor' | 'patch';
  changes: ChangelogChange[];
}

interface ChangelogResponse {
  entries: ChangelogEntry[];
  total: number;
}

const route = useRoute();
const router = useRouter();

const selectedType = ref((route.query.type as string) || '');

const changeTypes = [
  { value: 'feature', label: 'Features', icon: 'i-lucide-sparkles' },
  { value: 'fix', label: 'Fixes', icon: 'i-lucide-bug' },
  { value: 'improvement', label: 'Improvements', icon: 'i-lucide-trending-up' },
];

// Fetch all entries (unfiltered) for counts
const { data: allData } = await useFetch<ChangelogResponse>('/api/changelog');
const allEntries = computed(() => allData.value?.entries || []);

// Fetch filtered entries
const { data, refresh } = await useFetch<ChangelogResponse>('/api/changelog', {
  query: computed(() => ({
    type: selectedType.value || undefined,
  })),
  watch: false,
});

const entries = computed(() => data.value?.entries || []);

function filterByType(type: string) {
  selectedType.value = type;
  if (type) {
    router.push({ query: { type } });
  } else {
    router.push({ query: {} });
  }
  refresh();
}

function countByType(type: string): number {
  return allEntries.value.filter(entry =>
    entry.changes?.some(c => c.type === type),
  ).length;
}

function getVersionColor(type: string): 'error' | 'primary' | 'neutral' {
  switch (type) {
    case 'major': return 'error';
    case 'minor': return 'primary';
    case 'patch': return 'neutral';
    default: return 'neutral';
  }
}

function getChangeIcon(type: string): string {
  switch (type) {
    case 'feature': return 'i-lucide-sparkles';
    case 'fix': return 'i-lucide-bug';
    case 'improvement': return 'i-lucide-trending-up';
    default: return 'i-lucide-circle';
  }
}

function getChangeColor(type: string): string {
  switch (type) {
    case 'feature': return 'text-primary';
    case 'fix': return 'text-red-500';
    case 'improvement': return 'text-green-500';
    default: return 'text-neutral-400';
  }
}

// Watch route changes
watch(
  () => route.query.type,
  (newType) => {
    selectedType.value = (newType as string) || '';
    refresh();
  },
);

useSeoMeta({
  title: 'Changelog - Bistro',
  description: 'Track new features, improvements, and bug fixes in Bistro.',
  ogTitle: 'Changelog - Bistro',
  ogDescription: 'Track new features, improvements, and bug fixes in Bistro.',
});
</script>
