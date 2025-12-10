import { z } from 'zod';
import { slugSchema } from './common';
import type { Project } from '../../prisma/generated/client';

/**
 * Project validation schemas
 */

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
  description: z.string().max(1000, 'Description must be 1000 characters or less').optional(),
  slug: slugSchema,
});

export const updateProjectSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less')
    .optional(),
  description: z.string().max(1000, 'Description must be 1000 characters or less').optional(),
  slug: slugSchema.optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

// Type helper for API responses
export type ProjectResponse = Omit<Project, 'userId'>;
