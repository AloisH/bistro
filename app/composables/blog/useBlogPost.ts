import type { BlogCollectionItem } from '@nuxt/content';

export async function useBlogPost(slug: string) {
  const { isAdmin } = useRole();

  // Fetch post with async data for proper SSR
  const { data: post, error } = await useAsyncData<BlogCollectionItem>(`blog-post-${slug}`, () =>
    $fetch(`/api/blog/posts/${slug}`, {
      query: { includeDrafts: isAdmin.value },
    }),
  );

  // Setup SEO when post is available
  watch(
    post,
    (p) => {
      if (p) {
        useSeo({
          title: p.title,
          description: p.description,
          image: p.image,
          type: 'article',
          publishedTime: p.date,
          tags: p.tags,
          authorName: p.authors?.[0]?.name,
        });
      }
    },
    { immediate: true },
  );

  return {
    post,
    error,
    isAdmin,
  };
}
