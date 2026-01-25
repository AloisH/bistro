import type { BlogCollectionItem } from '@nuxt/content';

export function useBlogPost(slug: string) {
  const { isAdmin } = useRole();

  // Fetch post
  const { data: post } = useFetch<BlogCollectionItem>(`/api/blog/posts/${slug}`, {
    key: `blog-post-${slug}`,
    query: {
      includeDrafts: isAdmin.value,
    },
  });

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
    isAdmin,
  };
}
