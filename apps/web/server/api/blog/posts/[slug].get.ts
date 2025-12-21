import { serverQueryContent } from '#content/server';
import { requireRole } from '../../../utils/serverAuth';

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  const query = getQuery(event);
  const includeDrafts = query.includeDrafts === 'true';

  // Check if user is admin
  let isAdmin = false;
  try {
    const session = await requireRole(['ADMIN', 'SUPER_ADMIN'])(event);
    isAdmin = !!session;
  } catch {
    // Not admin
  }

  // Fetch post
  const post = await serverQueryContent(event, 'blog').where('_path', `/blog/${slug}`).findOne();

  // Return 404 if not found
  if (!post) {
    throw createError({
      statusCode: 404,
      message: 'Post not found',
    });
  }

  // Return 404 if draft and not admin
  if (post.draft && (!includeDrafts || !isAdmin)) {
    throw createError({
      statusCode: 404,
      message: 'Post not found',
    });
  }

  return post;
});
