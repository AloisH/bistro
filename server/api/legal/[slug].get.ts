import { queryCollection } from '@nuxt/content/server';

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');

  if (!slug || (slug !== 'privacy' && slug !== 'terms')) {
    throw createError({
      statusCode: 404,
      message: 'Page not found',
    });
  }

  const query = getQuery(event);
  const locale = query.locale === 'fr' ? 'fr' : null;
  const contentPath = locale ? `/legal/fr/${slug}` : `/legal/${slug}`;

  const page = await queryCollection(event, 'legal').path(contentPath).first();

  if (!page) {
    throw createError({
      statusCode: 404,
      message: 'Page not found',
    });
  }

  return page;
});
