<script setup lang="ts">
interface LegalPage {
  title: string;
  description: string;
  lastUpdated: string;
  body: unknown;
}

const { data: page } = await useFetch<LegalPage>('/api/legal/terms');

if (!page.value) {
  throw createError({
    statusCode: 404,
    message: 'Page not found',
  });
}

// SEO
useSeoMeta({
  title: page.value.title,
  description: page.value.description,
  ogTitle: page.value.title,
  ogDescription: page.value.description,
});
</script>

<template>
  <div class="container mx-auto px-4 py-12 max-w-4xl">
    <article v-if="page">
      <!-- Header -->
      <header class="mb-8 pb-8 border-b border-neutral-200 dark:border-neutral-800">
        <h1 class="text-4xl font-bold mb-4 text-neutral-900 dark:text-white">
          {{ page.title }}
        </h1>
        <p class="text-lg text-neutral-600 dark:text-neutral-400 mb-4">
          {{ page.description }}
        </p>
        <p class="text-sm text-neutral-500">
          Last updated: {{ new Date(page.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}
        </p>
      </header>

      <!-- Content -->
      <ContentRenderer
        :value="page"
        class="prose dark:prose-invert max-w-none"
      />
    </article>
  </div>
</template>
