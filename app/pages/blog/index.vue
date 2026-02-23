<script setup lang="ts">
const { t } = useI18n();

const { posts, total, totalPages, currentPage, selectedTag, allTags, limit, filterByTag }
  = await useBlogPosts();

useSeo({
  title: t('blog.seoTitle'),
  description: t('blog.seoDescription'),
});
</script>

<template>
  <div class="container mx-auto px-4 py-12">
    <!-- Hero Section -->
    <div
      class="from-primary-500/10 via-primary-600/5 dark:from-primary-400/10 dark:via-primary-500/5 relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-br to-transparent p-12"
    >
      <div class="bg-primary-500/20 absolute top-0 right-0 -z-10 h-96 w-96 rounded-full blur-3xl" />
      <div class="absolute bottom-0 left-0 -z-10 h-72 w-72 rounded-full bg-green-500/10 blur-3xl" />

      <div class="max-w-3xl">
        <h1
          class="mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-5xl font-bold text-transparent dark:from-white dark:to-gray-400"
        >
          {{ $t('blog.title') }}
        </h1>
        <p class="mb-8 text-xl text-neutral-600 dark:text-neutral-400">
          {{ $t('blog.description') }}
        </p>

        <div class="flex gap-8 text-sm">
          <div>
            <div class="text-2xl font-bold text-neutral-900 dark:text-white">
              {{ $t('blog.articlesCount', { total }) }}
            </div>
            <div class="text-neutral-600 dark:text-neutral-400">
              {{ $t('blog.articlesLabel') }}
            </div>
          </div>
          <div>
            <div class="text-2xl font-bold text-neutral-900 dark:text-white">
              {{ $t('blog.topicsCount', { total: allTags.length }) }}
            </div>
            <div class="text-neutral-600 dark:text-neutral-400">
              {{ $t('blog.topicsLabel') }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <BlogTagFilter
      v-if="allTags.length"
      :tags="allTags"
      :selected-tag="selectedTag"
      :total="total"
      @select="filterByTag"
    />

    <BlogPostGrid :posts="posts" />

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
