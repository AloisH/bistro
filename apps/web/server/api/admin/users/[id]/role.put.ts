import { updateRoleSchema } from '#shared/schemas/role';
import { requireRole } from '../../../../utils/require-role';
import { userRepository } from '../../../../features/user/user-repository';

/**
 * PUT /api/admin/users/:id/role
 * Update user role
 * Requires SUPER_ADMIN role
 */
export default defineEventHandler(async (event) => {
  // Check role - only SUPER_ADMIN can change roles
  const ctx = await requireRole(event, ['SUPER_ADMIN']);

  // Get user ID from route params
  const userId = getRouterParam(event, 'id');
  if (!userId) {
    throw createError({
      statusCode: 400,
      message: 'User ID required',
    });
  }

  // Validate body
  const rawBody = await readBody(event);
  const validationResult = updateRoleSchema.safeParse(rawBody);

  if (!validationResult.success) {
    throw createError({
      statusCode: 400,
      message: 'Validation failed',
      data: validationResult.error.issues,
    });
  }

  // Prevent self-demotion
  if (userId === ctx.userId && validationResult.data.role !== 'SUPER_ADMIN') {
    throw createError({
      statusCode: 403,
      message: 'Cannot demote yourself',
    });
  }

  // Update role
  const user = await userRepository.updateRole(userId, validationResult.data.role);

  return {
    success: true,
    user,
  };
});
