import { defineApiHandler } from '../../utils/api-handler';
import { sessionService } from '../../features/auth/session-service';
import { serverAuth } from '../../features/auth/auth-session';

/**
 * PUT /api/user/current-organization
 * Set current organization in session
 * Pass null to clear current organization
 */
export default defineApiHandler(async (ctx) => {
  const body = await readBody(ctx.event);

  // organizationId can be string or null
  const organizationId = body?.organizationId ?? null;

  // Validate organizationId if provided
  if (organizationId !== null && typeof organizationId !== 'string') {
    throw createError({
      statusCode: 400,
      message: 'organizationId must be a string or null',
    });
  }

  // Get session token
  const session = await serverAuth().getSession({ headers: ctx.event.headers });
  if (!session?.session.token) {
    throw createError({
      statusCode: 401,
      message: 'Session token not found',
    });
  }

  // Update current organization (verifies membership if org provided)
  await sessionService.setCurrentOrganization(session.session.token, ctx.userId, organizationId);

  return { success: true };
});
