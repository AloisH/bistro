import { defineValidatedApiHandler } from '../../utils/api-handler';
import { createOrganizationSchema } from '#shared/schemas/organization';
import { organizationService } from '../../features/organization/organization-service';

/**
 * POST /api/organizations
 * Create new organization
 * Creator is automatically added as OWNER
 */
export default defineValidatedApiHandler(createOrganizationSchema, async (ctx) => {
  const organization = await organizationService.createOrganization(ctx.userId, ctx.body!);
  return { organization };
});
