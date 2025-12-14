import { z } from 'zod';

/**
 * User validation schemas
 */

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  image: z.url().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  revokeOtherSessions: z.boolean().optional(),
});

export const deleteAccountPasswordSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

export const deleteAccountEmailSchema = z.object({
  email: z.email('Invalid email address'),
});

export const deleteAccountSchema = z.object({
  password: z.string().optional(),
  email: z.email().optional(),
});

export const updateOnboardingSchema = z.object({
  step: z.enum(['profile', 'preferences', 'useCase']),
  data: z.object({
    bio: z.string().max(500).optional(),
    company: z.string().max(100).optional(),
    emailNotifications: z.boolean().optional(),
    useCase: z.enum(['personal', 'business', 'agency', 'other']).optional(),
  }),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type DeleteAccountPasswordInput = z.infer<typeof deleteAccountPasswordSchema>;
export type DeleteAccountEmailInput = z.infer<typeof deleteAccountEmailSchema>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
export type UpdateOnboardingInput = z.infer<typeof updateOnboardingSchema>;

export interface OnboardingState {
  completed: boolean;
  steps: Record<string, boolean>;
  data: {
    bio?: string | null;
    company?: string | null;
    useCase?: string | null;
  };
}

// User profile type
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  image: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  hasPassword: boolean;
}
