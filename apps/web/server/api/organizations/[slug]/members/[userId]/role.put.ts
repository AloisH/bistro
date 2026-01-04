import { defineValidatedApiHandler } from '../../../../../utils/api-handler';
import { updateMemberRoleSchema } from '#shared/schemas/organization';
import { organizationService } from '../../../../../features/organization/organization-service';
import { organizationRepository } from '../../../../../features/organization/organization-repository';

/**
 * PUT /api/organizations/:slug/members/:userId/role
 * Update member role
 * User must be OWNER
 */
export default defineValidatedApiHandler(updateMemberRoleSchema, async (ctx) => {
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

  const member = await organizationService.updateMemberRole(
    ctx.userId,
    org.id,
    userId,
    ctx.body!.role,
  );

  return { member };
});
