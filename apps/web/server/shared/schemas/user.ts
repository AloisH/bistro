import { z } from 'zod'
import type { User } from '../../../prisma/generated/client'

/**
 * User validation schemas
 */

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less').optional(),
  image: z.string().url('Must be a valid URL').optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

// Type helper for API responses
export type UserProfile = Pick<User, 'id' | 'email' | 'name' | 'image' | 'emailVerified' | 'createdAt' | 'updatedAt'>
