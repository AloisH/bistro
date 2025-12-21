import type { BlogCollectionItem } from '@nuxt/content';
import { queryCollection } from '@nuxt/content/nitro';
import { Feed } from 'feed';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const siteUrl = config.public.appUrl;

  // Create feed
  const feed = new Feed({
    title: 'Bistro Blog',
    description: 'Latest articles and updates from Bistro',
    id: siteUrl,
    link: siteUrl,
    language: 'en',
    image: `${siteUrl}/og-image.png`,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}`,
    feedLinks: {
      rss2: `${siteUrl}/rss.xml`,
      json: `${siteUrl}/feed.json`,
      atom: `${siteUrl}/atom.xml`,
    },
  });

  // Fetch all published posts (exclude drafts)
  const allPosts = (await queryCollection(event, 'blog').all()) as BlogCollectionItem[];

  // Filter out drafts
  const posts = allPosts.filter((post: BlogCollectionItem) => !post.draft).reverse();

  // Add posts to feed
  for (const post of posts) {
    feed.addItem({
      title: post.title || '',
      id: `${siteUrl}${post.path}`,
      link: `${siteUrl}${post.path}`,
      description: post.description || '',
      content: '', // Body is a MarkdownRoot object, not a string
      author: post.authors?.map((a: { name: string }) => ({
        name: a.name,
      })),
      date: new Date(post.date),
      image: post.image ? `${siteUrl}${post.image}` : undefined,
      category: post.tags?.map((t: string) => ({ name: t })),
    });
  }

  // Set headers
  setHeader(event, 'Content-Type', 'application/rss+xml');

  // Return RSS XML
  return feed.rss2();
});
