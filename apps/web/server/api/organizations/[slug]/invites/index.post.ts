import { defineValidatedApiHandler } from '../../../../utils/api-handler';
import { inviteMemberSchema } from '#shared/organization';
import { organizationService } from '../../../../features/organization/organization-service';
import { organizationRepository } from '../../../../features/organization/organization-repository';

/**
 * POST /api/organizations/:slug/invites
 * Invite member to organization
 * User must be OWNER or ADMIN
 */
export default defineValidatedApiHandler(inviteMemberSchema, async (ctx) => {
  const slug = getRouterParam(ctx.event, 'slug');
  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Organization slug is required',
    });
  }

  // Lookup organization by slug
  const org = await organizationRepository.findBySlug(slug);
  if (!org) {
    throw createError({
      statusCode: 404,
      message: 'Organization not found',
    });
  }

  // Create invite (service checks OWNER/ADMIN permissions)
  const invite = await organizationService.inviteMember(ctx.userId, org.id, ctx.body!);
  return { invite };
});
