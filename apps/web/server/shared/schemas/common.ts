import { z } from 'zod'

/**
 * Common Zod schemas reusable across all models
 */

export const idSchema = z.string().cuid()

export const slugSchema = z
  .string()
  .min(1, 'Slug is required')
  .max(100, 'Slug must be 100 characters or less')
  .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens')

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
})

export type Pagination = z.infer<typeof paginationSchema>
