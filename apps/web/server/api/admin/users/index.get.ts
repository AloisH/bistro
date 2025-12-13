import { requireRole } from '../../../utils/require-role';
import { userRepository } from '../../../features/user/user-repository';

/**
 * GET /api/admin/users
 * List all users with their roles
 * Requires ADMIN or SUPER_ADMIN role
 */
export default defineEventHandler(async (event) => {
  // Check role - both ADMIN and SUPER_ADMIN can view users
  await requireRole(event, ['ADMIN', 'SUPER_ADMIN']);

  // Get all users
  const users = await userRepository.listAllUsers();

  return {
    users,
  };
});
