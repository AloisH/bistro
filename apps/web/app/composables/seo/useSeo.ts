/**
 * Centralized SEO composable for consistent meta tag handling
 */
export interface SeoOptions {
  /** Page title - " - Bistro" appended if not present */
  title: string;
  /** Page description for meta and OG tags */
  description: string;
  /** OG image URL (defaults to /og-image.png) */
  image?: string;
  /** Page type for og:type */
  type?: 'website' | 'article';
  /** Article publish date (ISO string) */
  publishedTime?: string;
  /** Article tags */
  tags?: string[];
  /** Whether to skip canonical URL (e.g., for dynamic pages) */
  noCanonical?: boolean;
  /** Article author name */
  authorName?: string;
}

export function useSeo(options: SeoOptions) {
  const route = useRoute();
  const config = useRuntimeConfig();
  const siteUrl = config.public.appUrl || 'http://localhost:3000';

  // Auto-append " - Bistro" if not present
  const fullTitle = options.title.includes('Bistro')
    ? options.title
    : `${options.title} - Bistro`;

  const image = options.image || '/og-image.png';
  // Ensure image is absolute URL
  const absoluteImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

  useSeoMeta({
    title: fullTitle,
    description: options.description,
    ogTitle: fullTitle,
    ogDescription: options.description,
    ogImage: absoluteImage,
    ogType: options.type || 'website',
    twitterCard: 'summary_large_image',
    twitterImage: absoluteImage,
    ...(options.publishedTime && { articlePublishedTime: options.publishedTime }),
    ...(options.tags?.length && { articleTag: options.tags }),
  });

  // Build head arrays
  const links: { rel: string; href: string }[] = [];
  const scripts: { type: string; innerHTML: string }[] = [];

  // Add canonical URL unless explicitly skipped
  if (!options.noCanonical) {
    links.push({ rel: 'canonical', href: `${siteUrl}${route.path}` });
  }

  // Add JSON-LD for articles (BlogPosting schema)
  if (options.type === 'article' && options.publishedTime) {
    const blogPostingSchema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': options.title,
      'description': options.description,
      'image': absoluteImage,
      'datePublished': options.publishedTime,
      'url': `${siteUrl}${route.path}`,
      ...(options.authorName && {
        author: {
          '@type': 'Person',
          'name': options.authorName,
        },
      }),
      'publisher': {
        '@type': 'Organization',
        'name': 'Bistro',
        'url': siteUrl,
      },
    };

    scripts.push({
      type: 'application/ld+json',
      innerHTML: JSON.stringify(blogPostingSchema),
    });
  }

  useHead({
    link: links,
    script: scripts,
  });
}
