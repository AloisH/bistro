import { z } from 'zod';

/**
 * Role enum schema matching Prisma enum
 */
export const roleSchema = z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']);

export type Role = z.infer<typeof roleSchema>;

/**
 * Update user role schema
 */
export const updateRoleSchema = z.object({
  role: roleSchema,
});

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
