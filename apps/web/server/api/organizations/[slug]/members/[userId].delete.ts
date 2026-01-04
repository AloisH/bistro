import { defineApiHandler } from '../../../../utils/api-handler';
import { organizationService } from '../../../../features/organization/organization-service';
import { organizationRepository } from '../../../../features/organization/organization-repository';

/**
 * DELETE /api/organizations/:slug/members/:userId
 * Remove member from organization
 * User must be OWNER or ADMIN
 */
export default defineApiHandler(async (ctx) => {
  const slug = getRouterParam(ctx.event, 'slug');
  const userId = getRouterParam(ctx.event, 'userId');

  if (!slug || !userId) {
    throw createError({
      statusCode: 400,
      message: 'Slug and userId required',
    });
  }

  const org = await organizationRepository.findBySlug(slug);
  if (!org) {
    throw createError({
      statusCode: 404,
      message: 'Organization not found',
    });
  }

  await organizationService.removeMember(ctx.userId, org.id, userId);
  return { success: true };
});
