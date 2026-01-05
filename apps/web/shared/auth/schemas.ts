import { z } from 'zod';
import { PASSWORD_MIN_LENGTH } from './constants';

/**
 * Auth validation schemas
 */

export const signInSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`),
});

export const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`),
});

export const forgotPasswordSchema = z.object({
  email: z.email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`),
  token: z.string(),
});

export const magicLinkSchema = z.object({
  email: z.email('Invalid email address'),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type MagicLinkInput = z.infer<typeof magicLinkSchema>;
