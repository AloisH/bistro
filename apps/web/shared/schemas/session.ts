import { z } from 'zod';

/**
 * Session validation schemas
 */

export const revokeSessionSchema = z.object({
  sessionId: z.string().cuid('Invalid session ID'),
});

export type RevokeSessionInput = z.infer<typeof revokeSessionSchema>;
