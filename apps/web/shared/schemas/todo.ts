import { z } from 'zod';

/**
 * Todo validation schemas
 */

export const createTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
});

export const updateTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters').optional(),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  completed: z.boolean().optional(),
});

export const toggleTodoSchema = z.object({
  completed: z.boolean(),
});

export const todoQuerySchema = z.object({
  filter: z.enum(['all', 'active', 'completed']).default('all'),
  sort: z.enum(['date', 'title']).default('date'),
});

export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type ToggleTodoInput = z.infer<typeof toggleTodoSchema>;
export type TodoQueryInput = z.infer<typeof todoQuerySchema>;
