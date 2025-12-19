import { defineCollection, defineContentConfig, z } from '@nuxt/content';

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.coerce.date(),
        image: z.string().optional(),
        authors: z
          .array(
            z.object({
              name: z.string(),
              avatar: z.string().optional(),
            }),
          )
          .optional(),
        tags: z.array(z.string()).default([]),
      }),
    }),
    docs: defineCollection({
      type: 'page',
      source: 'docs/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        navigation: z
          .object({
            title: z.string().optional(),
            icon: z.string().optional(),
            order: z.number().optional(),
          })
          .optional(),
      }),
    }),
    legal: defineCollection({
      type: 'page',
      source: 'legal/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        lastUpdated: z.coerce.date(),
      }),
    }),
  },
});
