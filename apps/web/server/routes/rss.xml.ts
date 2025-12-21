import { Feed } from 'feed';
import { serverQueryContent } from '#content/server';

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
  const posts = await serverQueryContent(event, 'blog')
    .where('draft', { $ne: true })
    .sort({ date: -1 })
    .find();

  // Add posts to feed
  for (const post of posts) {
    feed.addItem({
      title: post.title || '',
      id: `${siteUrl}${post._path}`,
      link: `${siteUrl}${post._path}`,
      description: post.description || '',
      content: post.body,
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
