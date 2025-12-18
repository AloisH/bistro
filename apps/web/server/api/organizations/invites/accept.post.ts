import { defineApiHandler } from '../../../utils/api-handler';
import { organizationService } from '../../../features/organization/organization-service';

/**
 * POST /api/organizations/invites/accept
 * Accept organization invite
 * Requires token in request body
 */
export default defineApiHandler(async (ctx) => {
  const body = await readBody(ctx.event);

  if (!body?.token) {
    throw createError({
      statusCode: 400,
      message: 'Invite token is required',
    });
  }

  // Accept invite (validates token, email match, expiry)
  const member = await organizationService.acceptInvite(ctx.userId, body.token);
  return { member };
});
