import { requireRole } from '../../../utils/require-role';
import { impersonationService } from '../../../features/impersonation/impersonation-service';

/**
 * GET /api/admin/impersonate/active
 * Get active impersonation session
 * Requires SUPER_ADMIN role
 */
export default defineEventHandler(async (event) => {
  // Check role
  const ctx = await requireRole(event, ['SUPER_ADMIN']);

  // Get active session
  const activeSession = await impersonationService.getActiveImpersonation(ctx.userId);

  return {
    active: !!activeSession,
    session: activeSession,
  };
});
