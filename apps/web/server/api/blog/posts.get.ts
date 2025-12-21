import { serverQueryContent } from '#content/server';
import { requireRole } from '../../utils/serverAuth';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = Number.parseInt(query.page as string) || 1;
  const limit = Number.parseInt(query.limit as string) || 12;
  const tag = query.tag as string;
  const includeDrafts = query.includeDrafts === 'true';

  // Check if user is admin (for draft posts)
  let isAdmin = false;
  try {
    const session = await requireRole(['ADMIN', 'SUPER_ADMIN'])(event);
    isAdmin = !!session;
  } catch {
    // Not admin, continue without drafts
  }

  // Build query
  let queryBuilder = serverQueryContent(event, 'blog').sort({ date: -1 });

  // Filter drafts (unless admin requested them)
  if (!includeDrafts || !isAdmin) {
    queryBuilder = queryBuilder.where('draft', { $ne: true });
  }

  // Filter by tag
  if (tag) {
    queryBuilder = queryBuilder.where('tags', { $contains: tag });
  }

  // Get total count
  const allPosts = await queryBuilder.find();
  const total = allPosts.length;

  // Apply pagination
  const posts = await queryBuilder
    .skip((page - 1) * limit)
    .limit(limit)
    .find();

  return {
    posts,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
});
