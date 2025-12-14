import { serverAuth } from '../../../features/auth/auth-session';
import { impersonationService } from '../../../features/impersonation/impersonation-service';

/**
 * POST /api/admin/impersonate/stop
 * Stop impersonating current user
 * Note: During impersonation, session user = impersonated user
 */
export default defineEventHandler(async (event) => {
  // Get session to find admin ID
  const session = await serverAuth().getSession({ headers: event.headers });
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  // Extract adminId from session:
  // - During active impersonation: session.impersonatedBy contains admin ID
  // - After session expired/cleared: user.id is admin ID (session restored)
  const adminId = session.session?.impersonatedBy || session.user.id;

  // Find active log by adminId (same logic as /active endpoint)
  const activeLog = await impersonationService.getActiveImpersonation(adminId);

  if (!activeLog) {
    throw createError({
      statusCode: 400,
      message: 'No active impersonation session',
    });
  }

  // Stop using adminId (handles both active impersonation + orphaned logs)
  await impersonationService.stopImpersonation(adminId, event);

  return {
    success: true,
  };
});
