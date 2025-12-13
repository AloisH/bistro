import { requireRole } from '../../../utils/require-role';
import { impersonationService } from '../../../features/impersonation/impersonation-service';

/**
 * POST /api/admin/impersonate/stop
 * Stop impersonating current user
 * Requires SUPER_ADMIN role
 */
export default defineEventHandler(async (event) => {
  // Check role
  const ctx = await requireRole(event, ['SUPER_ADMIN']);

  // Stop impersonation
  await impersonationService.stopImpersonation(ctx.userId, event);

  return {
    success: true,
  };
});
