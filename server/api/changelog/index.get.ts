import type { ChangelogCollectionItem } from '@nuxt/content';
import { queryCollection } from '@nuxt/content/nitro';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const type = query.type as string;

  const allEntries = (await queryCollection(event, 'changelog').all()) as ChangelogCollectionItem[];

  // Sort by date descending
  const sorted = allEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Filter by change type if specified
  const filtered = type
    ? sorted.filter(entry => entry.changes?.some(c => c.type === type))
    : sorted;

  return {
    entries: filtered,
    total: filtered.length,
  };
});
