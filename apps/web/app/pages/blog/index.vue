<template>
  <div class="container mx-auto px-4 py-12">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold mb-4">Blog</h1>
      <p class="text-lg text-gray-600 dark:text-gray-400">Latest articles and updates</p>
    </div>

    <!-- Tag filters -->
    <div
      v-if="allTags.length"
      class="mb-6 flex gap-2 flex-wrap"
    >
      <UBadge
        v-for="t in allTags"
        :key="t.name"
        :color="selectedTag === t.name ? 'primary' : 'neutral'"
        class="cursor-pointer"
        @click="filterByTag(t.name)"
      >
        {{ t.name }} ({{ t.count }})
      </UBadge>
    </div>

    <!-- Posts grid -->
    <UBlogPosts
      v-if="posts?.length"
      :posts="posts"
      orientation="horizontal"
    />
    <p
      v-else
      class="text-center text-gray-500 py-12"
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
} = await useFetch<{ posts: BlogCollectionItem[]; total: number; page: number; limit: number; totalPages: number }>('/api/blog/posts', {
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
  // Transform authors to match UBlogPosts expected format
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

// Filter by tag
function filterByTag(tag: string) {
  if (selectedTag.value === tag) {
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

// Change page
watch(currentPage, (newPage) => {
  const query: Record<string, string> = { page: newPage.toString() };
  if (selectedTag.value) {
    query.tag = selectedTag.value;
  }
  router.push({ query });
  refresh();
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
