<template>
  <div class="container mx-auto px-4 py-12 max-w-4xl">
    <!-- Draft badge for admins -->
    <UAlert
      v-if="post?.draft && isAdmin"
      color="warning"
      icon="i-lucide-file-edit"
      title="Draft Post"
      description="This post is not published and only visible to admins"
      class="mb-6"
    />

    <article v-if="post">
      <!-- Hero image -->
      <img
        v-if="post.image"
        :src="post.image"
        :alt="post.title"
        class="w-full h-64 object-cover rounded-lg mb-8"
      >

      <!-- Title & meta -->
      <header class="mb-8">
        <h1 class="text-5xl font-bold mb-4">{{ post.title }}</h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-4">{{ post.description }}</p>

        <div class="flex items-center gap-4 text-sm text-gray-500">
          <time :datetime="post.date">
            {{ formatDate(post.date) }}
          </time>
          <div
            v-if="post.authors?.length"
            class="flex items-center gap-2"
          >
            <span>by</span>
            <div
              v-for="author in post.authors"
              :key="author.name"
              class="flex items-center gap-1"
            >
              <img
                v-if="author.avatar"
                :src="author.avatar"
                :alt="author.name"
                class="w-6 h-6 rounded-full"
              >
              <span>{{ author.name }}</span>
            </div>
          </div>
        </div>

        <!-- Tags -->
        <div
          v-if="post.tags?.length"
          class="mt-4 flex gap-2"
        >
          <UBadge
            v-for="tag in post.tags"
            :key="tag"
            color="neutral"
            :to="`/blog?tag=${tag}`"
          >
            {{ tag }}
          </UBadge>
        </div>
      </header>

      <!-- Content -->
      <ContentRenderer
        :value="post"
        class="prose dark:prose-invert max-w-none"
      />
    </article>

    <!-- Back to blog -->
    <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <UButton
        to="/blog"
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="ghost"
      >
        Back to Blog
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BlogCollectionItem } from '@nuxt/content';

const route = useRoute();
const { isAdmin } = useRole();

const slug = route.params.slug as string;

// Fetch post
const { data: post } = await useFetch<BlogCollectionItem>(`/api/blog/posts/${slug}`, {
  query: {
    includeDrafts: isAdmin.value,
  },
});

// 404 if not found
if (!post.value) {
  throw createError({
    statusCode: 404,
    message: 'Post not found',
  });
}

// SEO
useSeoMeta({
  title: post.value.title,
  description: post.value.description,
  ogTitle: post.value.title,
  ogDescription: post.value.description,
  ogImage: post.value.image,
  articlePublishedTime: post.value.date,
  articleTag: post.value.tags,
});

// Format date
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
</script>
