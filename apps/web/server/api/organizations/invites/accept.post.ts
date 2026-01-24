import { defineApiHandler } from '../../../utils/api-handler';
import { organizationService } from '../../../features/organization/organization-service';

defineRouteMeta({
  openAPI: {
    tags: ['Organizations'],
    description: 'Accept organization invite with token',
  },
});

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
