import { defineValidatedApiHandler } from '../../../utils/api-handler';
import { updateOrganizationSchema } from '#shared/organization';
import { organizationService } from '../../../features/organization/organization-service';
import { organizationRepository } from '../../../features/organization/organization-repository';

defineRouteMeta({
  openAPI: {
    tags: ['Organizations'],
    description: 'Update organization (requires OWNER/ADMIN)',
    parameters: [{ in: 'path', name: 'slug', required: true, description: 'Organization slug' }],
  },
});

export default defineValidatedApiHandler(updateOrganizationSchema, async (ctx) => {
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

  // Update (service checks OWNER/ADMIN permissions)
  const organization = await organizationService.updateOrganization(ctx.userId, org.id, ctx.body!);
  return { organization };
});
