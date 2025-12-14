import { z } from 'zod';

/**
 * Email validation schemas
 */

export const sendEmailSchema = z.object({
  to: z.union([z.string().email(), z.array(z.string().email())]),
  subject: z.string().min(1, 'Subject is required'),
  html: z.string().min(1, 'HTML content is required'),
  text: z.string().optional(),
  from: z.string().email().optional(),
  replyTo: z.string().email().optional(),
});

export type SendEmailInput = z.infer<typeof sendEmailSchema>;
