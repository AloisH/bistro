import { z } from 'zod';
import { nameSchema, passwordSchema } from './common';
import type { User } from '../../prisma/generated/client';

/**
 * User validation schemas
 */

export const updateProfileSchema = z.object({
  name: nameSchema.optional(),
  image: z.string().url('Must be a valid URL').optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
  revokeOtherSessions: z.boolean().default(true),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const deleteAccountPasswordSchema = z.object({
  password: z.string().min(1, 'Password required'),
});

export const deleteAccountEmailSchema = z.object({
  email: z.string().min(1, 'Email required'),
});

export type DeleteAccountPasswordInput = z.infer<typeof deleteAccountPasswordSchema>;
export type DeleteAccountEmailInput = z.infer<typeof deleteAccountEmailSchema>;

// Type helper for API responses
export type UserProfile = Pick<
  User,
  'id' | 'email' | 'name' | 'image' | 'emailVerified' | 'createdAt' | 'updatedAt'
> & {
  hasPassword: boolean;
};
