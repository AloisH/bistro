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
      <!-- Back button -->
      <div class="mb-8">
        <UButton
          to="/blog"
          variant="ghost"
          icon="i-lucide-arrow-left"
          size="sm"
          class="group"
        >
          <span class="group-hover:-translate-x-1 transition-transform inline-block">
            Back to Blog
          </span>
        </UButton>
      </div>

      <!-- Hero image with overlay -->
      <div class="relative -mx-4 sm:mx-0 mb-12">
        <div class="relative h-[400px] rounded-3xl overflow-hidden">
          <img
            v-if="post.image"
            :src="post.image"
            :alt="post.title"
            class="w-full h-full object-cover"
          >
          <!-- Gradient overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

          <!-- Content overlay -->
          <div class="absolute bottom-0 left-0 right-0 p-8 text-white">
            <!-- Tags -->
            <div
              v-if="post.tags?.length"
              class="flex gap-2 mb-4 flex-wrap"
            >
              <UBadge
                v-for="tag in post.tags"
                :key="tag"
                :to="`/blog?tag=${tag}`"
                variant="solid"
                color="primary"
              >
                {{ tag }}
              </UBadge>
            </div>

            <!-- Title -->
            <h1 class="text-4xl md:text-5xl font-bold mb-4">
              {{ post.title }}
            </h1>

            <!-- Description -->
            <p class="text-xl text-neutral-200 mb-6 max-w-3xl">
              {{ post.description }}
            </p>

            <!-- Meta -->
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <UAvatar
                  v-if="post.authors?.[0]"
                  :src="post.authors[0].avatar"
                  :alt="post.authors[0].name"
                />
                <span class="font-medium">{{ post.authors?.[0]?.name }}</span>
              </div>
              <span>•</span>
              <time :datetime="post.date">
                {{ formatDate(post.date) }}
              </time>
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <ContentRenderer
        :value="post"
        class="prose dark:prose-invert max-w-none"
      />

      <!-- Author card -->
      <UCard class="mt-12 bg-gradient-to-br from-primary-500/5 to-transparent dark:from-primary-400/10">
        <div class="flex gap-4">
          <UAvatar
            v-if="post.authors?.[0]"
            :src="post.authors[0].avatar"
            :alt="post.authors[0].name"
            size="lg"
          />
          <div>
            <div class="font-semibold text-lg text-neutral-900 dark:text-white mb-1">
              {{ post.authors?.[0]?.name }}
            </div>
            <p class="text-neutral-600 dark:text-neutral-400 text-sm">
              Author • Full-stack developer
            </p>
          </div>
        </div>
      </UCard>
    </article>
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
