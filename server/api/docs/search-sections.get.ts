import { queryCollectionSearchSections } from '@nuxt/content/nitro';

export default defineEventHandler(async (event) => {
  const sections = await queryCollectionSearchSections(event, 'docs', {
    ignoredTags: ['pre', 'code'],
  });

  return sections;
});
