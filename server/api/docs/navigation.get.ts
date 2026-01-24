import { queryCollectionNavigation } from '@nuxt/content/nitro';

export default defineEventHandler(async (event) => {
  const navigation = await queryCollectionNavigation(event, 'docs');
  return navigation;
});
