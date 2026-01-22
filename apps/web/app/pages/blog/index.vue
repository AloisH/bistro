<template>
  <div class="container mx-auto px-4 py-12">
    <!-- Hero Section -->
    <div
      class="from-primary-500/10 via-primary-600/5 dark:from-primary-400/10 dark:via-primary-500/5 relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-br to-transparent p-12"
    >
      <!-- Decorative gradient orbs -->
      <div class="bg-primary-500/20 absolute top-0 right-0 -z-10 h-96 w-96 rounded-full blur-3xl" />
      <div class="absolute bottom-0 left-0 -z-10 h-72 w-72 rounded-full bg-green-500/10 blur-3xl" />

      <div class="max-w-3xl">
        <h1
          class="mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-5xl font-bold text-transparent dark:from-white dark:to-gray-400"
        >
          Blog
        </h1>
        <p class="mb-8 text-xl text-neutral-600 dark:text-neutral-400">
          Thoughts, tutorials, and insights on building modern SaaS applications
        </p>

        <!-- Stats/highlights -->
        <div class="flex gap-8 text-sm">
          <div>
            <div class="text-2xl font-bold text-neutral-900 dark:text-white">
              {{ total }}
            </div>
            <div class="text-neutral-600 dark:text-neutral-400">Articles</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-neutral-900 dark:text-white">
              {{ allTags.length }}
            </div>
            <div class="text-neutral-600 dark:text-neutral-400">Topics</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tag filters -->
    <div
      v-if="allTags.length"
      class="mb-8"
    >
      <div class="mb-4 flex items-center gap-3">
        <UIcon
          name="i-lucide-tag"
          class="text-neutral-400"
        />
        <h2 class="text-lg font-semibold text-neutral-900 dark:text-white">Filter by topic</h2>
      </div>

      <div class="flex flex-wrap gap-2">
        <!-- All posts badge -->
        <UBadge
          variant="subtle"
          :color="!selectedTag ? 'primary' : 'neutral'"
          class="cursor-pointer"
          @click="filterByTag('')"
        >
          All ({{ total }})
        </UBadge>

        <!-- Tag badges -->
        <UBadge
          v-for="tag in allTags"
          :key="tag.name"
          variant="subtle"
          :color="selectedTag === tag.name ? 'primary' : 'neutral'"
          class="cursor-pointer"
          @click="filterByTag(tag.name)"
        >
          {{ tag.name }} ({{ tag.count }})
        </UBadge>
      </div>
    </div>

    <!-- Posts grid -->
    <div
      v-if="posts?.length"
      class="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
    >
      <NuxtLink
        v-for="(post, index) in posts"
        :key="post.path"
        :to="post.path"
        :style="{ animationDelay: `${index * 50}ms` }"
        class="group animate-fade-in-up block"
      >
        <UCard class="h-full overflow-hidden transition-shadow duration-300 hover:shadow-lg">
          <!-- Image -->
          <template #header>
            <div class="relative -m-6 mb-0 aspect-video overflow-hidden">
              <img
                :src="post.image"
                :alt="post.title"
                class="h-full w-full object-cover"
              >
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </div>
          </template>

          <!-- Content -->
          <div class="p-6">
            <!-- Tags -->
            <div class="mb-3 flex flex-wrap gap-2">
              <UBadge
                v-for="tag in post.tags?.slice(0, 2)"
                :key="tag"
                variant="subtle"
                color="primary"
                size="xs"
              >
                {{ tag }}
              </UBadge>
            </div>

            <!-- Title -->
            <h3
              class="group-hover:text-primary-500 dark:group-hover:text-primary-400 mb-2 text-xl font-semibold text-neutral-900 transition-colors dark:text-white"
            >
              {{ post.title }}
            </h3>

            <!-- Description -->
            <p class="mb-4 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
              {{ post.description }}
            </p>

            <!-- Meta -->
            <div class="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-500">
              <div class="flex items-center gap-2">
                <UAvatar
                  v-if="post.authors?.[0]"
                  :src="post.authors[0].avatar?.src"
                  :alt="post.authors[0].name"
                  size="xs"
                />
                <span>{{ post.authors?.[0]?.name }}</span>
              </div>
              <span>•</span>
              <span>{{ formatDate(post.date) }}</span>
            </div>
          </div>
        </UCard>
      </NuxtLink>
    </div>

    <!-- Empty state -->
    <p
      v-else
      class="py-12 text-center text-neutral-500"
    >
      No posts found. Check back soon!
    </p>

    <!-- Pagination -->
    <div
      v-if="totalPages > 1"
      class="mt-8 flex justify-center"
    >
      <UPagination
        v-model="currentPage"
        :total="total"
        :page-count="limit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BlogCollectionItem } from '@nuxt/content';

const route = useRoute();
const router = useRouter();
const { isAdmin } = useRole();

const currentPage = ref(Number.parseInt((route.query.page as string) || '1'));
const selectedTag = ref(route.query.tag as string);
const limit = 12;

// Fetch posts
const {
  data: postsData,
  status: _status,
  refresh,
} = await useFetch<{
  posts: BlogCollectionItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}>('/api/blog/posts', {
  query: computed(() => ({
    page: currentPage.value,
    limit,
    tag: selectedTag.value,
    includeDrafts: isAdmin.value,
  })),
  watch: false,
});

const posts = computed(() => {
  const rawPosts = postsData.value?.posts || [];
  // Transform authors to match expected format
  return rawPosts.map(post => ({
    ...post,
    authors: post.authors?.map(a => ({
      ...a,
      avatar: a.avatar ? { src: a.avatar } : undefined,
    })),
  }));
});
const total = computed(() => postsData.value?.total || 0);
const totalPages = computed(() => postsData.value?.totalPages || 1);

// Extract all tags with counts
const allTags = computed(() => {
  if (!posts.value.length) return [];

  const tagCounts = new Map<string, number>();
  for (const post of posts.value) {
    if (post.tags && Array.isArray(post.tags)) {
      for (const tag of post.tags) {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      }
    }
  }

  return Array.from(tagCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
});

// Format date helper
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Filter by tag
function filterByTag(tag: string) {
  if (selectedTag.value === tag || tag === '') {
    // Clear filter
    selectedTag.value = '';
    router.push({ query: { page: '1' } });
  } else {
    selectedTag.value = tag;
    currentPage.value = 1;
    router.push({ query: { tag, page: '1' } });
  }
  refresh();
}

// Change page with smooth scroll
watch(currentPage, (newPage) => {
  const query: Record<string, string> = { page: newPage.toString() };
  if (selectedTag.value) {
    query.tag = selectedTag.value;
  }
  router.push({ query });
  window.scrollTo({ top: 0, behavior: 'smooth' });
  refresh();
});

// Watch tag changes with smooth scroll
watch(selectedTag, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Watch route changes
watch(
  () => route.query,
  (newQuery) => {
    currentPage.value = Number.parseInt((newQuery.page as string) || '1');
    selectedTag.value = newQuery.tag as string;
    refresh();
  },
);

// SEO
useSeoMeta({
  title: 'Blog - Bistro',
  description: 'Latest articles and updates from Bistro',
  ogTitle: 'Blog - Bistro',
  ogDescription: 'Latest articles and updates from Bistro',
});
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out forwards;
  opacity: 0;
}
</style>
