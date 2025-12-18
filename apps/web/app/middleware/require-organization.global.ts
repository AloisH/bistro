/**
 * Global middleware to ensure user has selected/created an organization
 * Runs after auth.global.ts
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn } = useAuth();

  // Skip if not logged in (auth middleware handles this)
  if (!loggedIn.value) {
    return;
  }

  // Skip if already on organization-related pages
  const orgPages = ['/organizations/create', '/organizations/select', '/organizations/invite'];
  if (orgPages.some(page => to.path.startsWith(page))) {
    return;
  }

  // Skip if already on an org-scoped page (/org/[slug]/...)
  if (to.path.startsWith('/org/')) {
    return;
  }

  // Skip if on auth pages
  if (to.path.startsWith('/auth/')) {
    return;
  }

  // Skip if on user settings pages
  if (to.path.startsWith('/user/') || to.path === '/dashboard') {
    return;
  }

  // Check if user has organizations
  try {
    const { data } = await useFetch<{ organizations: unknown[] }>('/api/organizations');

    if (!data.value?.organizations) {
      return;
    }

    // If no orgs, redirect to create
    if (data.value.organizations.length === 0) {
      return navigateTo('/organizations/create');
    }

    // If has orgs, redirect to select
    return navigateTo('/organizations/select');
  } catch {
    // If error fetching orgs, allow navigation
    return;
  }
});
