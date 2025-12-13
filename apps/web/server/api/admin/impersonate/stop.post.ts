import { serverAuth } from '../../../features/auth/auth-session';
import { impersonationService } from '../../../features/impersonation/impersonation-service';

/**
 * POST /api/admin/impersonate/stop
 * Stop impersonating current user
 * Note: During impersonation, session user = impersonated user
 */
export default defineEventHandler(async (event) => {
  // Get session to find admin ID from impersonatedBy field
  const session = await serverAuth().getSession({ headers: event.headers });
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  // During impersonation, we need the admin ID from our audit log
  // Better Auth's stopImpersonating will use the session's impersonatedBy field
  // So we just pass the current user ID (which is the impersonated user during impersonation)
  await impersonationService.stopImpersonation(session.user.id, event);

  return {
    success: true,
  };
});
