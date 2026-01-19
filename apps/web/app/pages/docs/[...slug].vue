<script setup lang="ts">
definePageMeta({
  layout: 'docs',
});

interface TocLink {
  id: string;
  text: string;
  depth: number;
  children?: TocLink[];
}

interface DocsPage {
  title: string;
  description: string;
  body: {
    toc?: {
      links?: TocLink[];
    };
  };
}

const route = useRoute();
const slug = Array.isArray(route.params.slug)
  ? route.params.slug.join('/')
  : route.params.slug;

const { data: page } = await useFetch<DocsPage>(`/api/docs/${slug}`);

if (!page.value) {
  throw createError({
    statusCode: 404,
    message: 'Documentation page not found',
  });
}

const tocLinks = computed(() => page.value?.body?.toc?.links || []);

useSeoMeta({
  title: page.value.title,
  description: page.value.description,
  ogTitle: page.value.title,
  ogDescription: page.value.description,
});
</script>

<template>
  <div class="p-4 sm:p-6">
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-8 max-w-6xl mx-auto">
      <!-- Main content -->
      <article v-if="page">
        <header class="mb-8">
          <h1 class="text-4xl font-bold mb-4 text-neutral-900 dark:text-white">
            {{ page.title }}
          </h1>
          <p class="text-xl text-neutral-600 dark:text-neutral-400">
            {{ page.description }}
          </p>
        </header>

        <ContentRenderer
          :value="page"
          class="prose dark:prose-invert max-w-none"
        />

        <!-- Prev/Next navigation -->
        <div class="mt-12 pt-8 border-t border-default">
          <UContentSurround :query="{ path: `/docs/${slug}` }" />
        </div>
      </article>

      <!-- Right sidebar: Table of Contents (sticky, desktop only) -->
      <aside class="hidden lg:block">
        <div class="sticky top-6">
          <h3 class="text-sm font-semibold mb-4 text-neutral-900 dark:text-white">
            On this page
          </h3>
          <UContentToc
            v-if="tocLinks.length"
            :links="tocLinks"
            highlight
          />
          <p
            v-else
            class="text-sm text-neutral-500"
          >
            No sections
          </p>
        </div>
      </aside>
    </div>
  </div>
</template>
