import { defineApiHandler } from '../../utils/api-handler';
import { organizationRepository } from '../../features/organization/organization-repository';

defineRouteMeta({
  openAPI: {
    tags: ['Organizations'],
    description: 'List all organizations user belongs to',
  },
});

export default defineApiHandler(async (ctx) => {
  const organizations = await organizationRepository.findUserOrganizations(ctx.userId);
  return { organizations };
});
