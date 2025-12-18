import { defineApiHandler } from '../../utils/api-handler';
import { organizationRepository } from '../../features/organization/organization-repository';

/**
 * GET /api/organizations
 * List all organizations user belongs to
 */
export default defineApiHandler(async (ctx) => {
  const organizations = await organizationRepository.findUserOrganizations(ctx.userId);
  return { organizations };
});
