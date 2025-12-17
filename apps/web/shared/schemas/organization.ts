import { z } from 'zod';

/**
 * Organization validation schemas
 */

/**
 * Organization role enum matching Prisma
 */
export const organizationRoleSchema = z.enum(['OWNER', 'ADMIN', 'MEMBER', 'GUEST']);

export type OrganizationRole = z.infer<typeof organizationRoleSchema>;

/**
 * Organization slug validation
 * - Lowercase alphanumeric + hyphens
 * - 2-50 characters
 * - No leading/trailing hyphens
 */
export const slugSchema = z
  .string()
  .min(2, 'Slug must be at least 2 characters')
  .max(50, 'Slug must be at most 50 characters')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens');

/**
 * Create organization schema
 */
export const createOrganizationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters'),
  slug: slugSchema,
  description: z.string().max(500, 'Description must be at most 500 characters').optional(),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;

/**
 * Update organization schema
 */
export const updateOrganizationSchema = createOrganizationSchema.partial();

export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;

/**
 * Invite member schema
 */
export const inviteMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: organizationRoleSchema.default('MEMBER'),
});

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;

/**
 * Update member role schema
 */
export const updateMemberRoleSchema = z.object({
  role: organizationRoleSchema,
});

export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;
