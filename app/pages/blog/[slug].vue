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
        <UButton to="/blog" variant="ghost" icon="i-lucide-arrow-left" size="sm" class="group">
          <span class="inline-block transition-transform group-hover:-translate-x-1">
            Back to Blog
          </span>
        </UButton>
      </div>

      <BlogPostHero
        :title="post.title"
        :description="post.description"
        :image="post.image"
        :tags="post.tags"
        :date="post.date"
        :author="post.authors?.[0]"
      />

      <!-- Content -->
      <ContentRenderer :value="post" class="prose dark:prose-invert max-w-none" />

      <BlogPostAuthor
        v-if="post.authors?.[0]"
        :name="post.authors[0].name"
        :avatar="post.authors[0].avatar"
      />
    </article>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const slug = route.params.slug as string;

const { post, isAdmin } = useBlogPost(slug);

// 404 if not found
if (!post.value) {
  throw createError({
    statusCode: 404,
    message: 'Post not found',
  });
}
</script>
