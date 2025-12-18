import { requireOrgAccess } from '../../../utils/require-org-access';

/**
 * GET /api/organizations/:slug/members
 * List organization members
 * User must be a member
 */
export default defineEventHandler(async (event) => {
  const ctx = await requireOrgAccess(event);

  const { organizationRepository } = await import(
    '../../../features/organization/organization-repository'
  );

  const members = await organizationRepository.findOrganizationMembers(ctx.organizationId);

  return { members };
});
