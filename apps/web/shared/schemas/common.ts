import { z } from 'zod';

/**
 * Common Zod schemas reusable across all models
 */

export const idSchema = z.string().min(1);

export const slugSchema = z
  .string()
  .min(1, 'Slug is required')
  .max(100, 'Slug must be 100 characters or less')
  .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens');

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export type Pagination = z.infer<typeof paginationSchema>;

/**
 * Reusable field validators
 */

export const emailSchema = z.string().email('Invalid email address').toLowerCase();

export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be 100 characters or less');
