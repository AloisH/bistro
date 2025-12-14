import { z } from 'zod';

/**
 * Project validation schemas
 */

const slugSchema = z
  .string()
  .min(1, 'Slug is required')
  .max(100, 'Slug too long')
  .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens');

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(1000, 'Description too long').optional(),
  slug: slugSchema,
});

export const updateProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
  description: z.string().max(1000, 'Description too long').optional(),
  status: z.enum(['draft', 'active', 'archived']).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
