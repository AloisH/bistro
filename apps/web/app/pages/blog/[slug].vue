<template>
  <div class="container mx-auto max-w-4xl px-4 py-12">
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
          <span class="inline-block transition-transform group-hover:-translate-x-1">
            Back to Blog
          </span>
        </UButton>
      </div>

      <!-- Hero image with overlay -->
      <div class="relative -mx-4 mb-12 sm:mx-0">
        <div class="relative h-[400px] overflow-hidden rounded-3xl">
          <NuxtImg
            v-if="post.image"
            :src="post.image"
            :alt="post.title"
            loading="eager"
            class="h-full w-full object-cover"
          />
          <!-- Gradient overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

          <!-- Content overlay -->
          <div class="absolute right-0 bottom-0 left-0 p-8 text-white">
            <!-- Tags -->
            <div
              v-if="post.tags?.length"
              class="mb-4 flex flex-wrap gap-2"
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
            <h1 class="mb-4 text-4xl font-bold md:text-5xl">
              {{ post.title }}
            </h1>

            <!-- Description -->
            <p class="mb-6 max-w-3xl text-xl text-neutral-200">
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
      <UCard
        class="from-primary-500/5 dark:from-primary-400/10 mt-12 bg-gradient-to-br to-transparent"
      >
        <div class="flex gap-4">
          <UAvatar
            v-if="post.authors?.[0]"
            :src="post.authors[0].avatar"
            :alt="post.authors[0].name"
            size="lg"
          />
          <div>
            <div class="mb-1 text-lg font-semibold text-neutral-900 dark:text-white">
              {{ post.authors?.[0]?.name }}
            </div>
            <p class="text-sm text-neutral-600 dark:text-neutral-400">
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

// SEO with BlogPosting JSON-LD
useSeo({
  title: post.value.title,
  description: post.value.description,
  image: post.value.image,
  type: 'article',
  publishedTime: post.value.date,
  tags: post.value.tags,
  authorName: post.value.authors?.[0]?.name,
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
