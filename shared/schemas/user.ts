import { z } from 'zod'

/**
 * User validation schemas
 */

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  image: z.string().url().optional(),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  revokeOtherSessions: z.boolean().optional(),
})

export const deleteAccountPasswordSchema = z.object({
  password: z.string().min(1, 'Password is required'),
})

export const deleteAccountEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export const deleteAccountSchema = z.object({
  password: z.string().optional(),
  email: z.string().email().optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type DeleteAccountPasswordInput = z.infer<typeof deleteAccountPasswordSchema>
export type DeleteAccountEmailInput = z.infer<typeof deleteAccountEmailSchema>
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>

// User profile type
export interface UserProfile {
  id: string
  email: string
  name: string
  image: string | null
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
  hasPassword: boolean
}
