import { z } from 'zod';

/**
 * Start impersonation schema
 */
export const startImpersonationSchema = z.object({
  userId: z.string().min(1),
  reason: z.string().min(1).max(500).optional(),
});

export type StartImpersonationInput = z.infer<typeof startImpersonationSchema>;

/**
 * Impersonation log response
 */
export const impersonationLogSchema = z.object({
  id: z.string(),
  adminId: z.string(),
  targetUserId: z.string(),
  startedAt: z.date(),
  endedAt: z.date().nullable(),
  reason: z.string().nullable(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
});

export type ImpersonationLog = z.infer<typeof impersonationLogSchema>;
