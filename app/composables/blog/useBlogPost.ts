import type { BlogCollectionItem } from '@nuxt/content';

export async function useBlogPost(slug: string) {
  const { isAdmin } = useRole();

  // Fetch post with async data for proper SSR
  const { data: post, error } = await useAsyncData<BlogCollectionItem>(`blog-post-${slug}`, () =>
    $fetch(`/api/blog/posts/${slug}`, {
      query: { includeDrafts: isAdmin.value },
    }),
  );

  // Setup SEO immediately (data available after await)
  if (post.value) {
    useSeo({
      title: post.value.title,
      description: post.value.description,
      image: post.value.image,
      type: 'article',
      publishedTime: post.value.date,
      tags: post.value.tags,
      authorName: post.value.authors?.[0]?.name,
    });
  }

  return {
    post,
    error,
    isAdmin,
  };
}
