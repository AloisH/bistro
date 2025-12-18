import { defineApiHandler } from '../../../utils/api-handler';
import { organizationService } from '../../../features/organization/organization-service';
import { organizationRepository } from '../../../features/organization/organization-repository';

/**
 * DELETE /api/organizations/:slug
 * Delete organization
 * User must be OWNER
 */
export default defineApiHandler(async (ctx) => {
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

  // Delete (service checks OWNER permission)
  await organizationService.deleteOrganization(ctx.userId, org.id);
  return { success: true };
});
