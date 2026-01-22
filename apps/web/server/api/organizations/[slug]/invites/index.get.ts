import { requireOrgAccess } from '../../../../utils/require-org-access';

/**
 * GET /api/organizations/:slug/invites
 * List all invites for organization
 * User must be OWNER or ADMIN
 */
export default defineEventHandler(async (event) => {
  // Check user is OWNER or ADMIN
  const ctx = await requireOrgAccess(event, {
    allowedRoles: ['OWNER', 'ADMIN'],
  });

  // Get all invites for organization
  const { organizationRepository } =
    await import('../../../../features/organization/organization-repository');
  const invites = await organizationRepository.findInvitesByOrganization(ctx.organizationId);

  return { invites };
});
