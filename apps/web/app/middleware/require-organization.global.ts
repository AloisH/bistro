/**
 * Global middleware to ensure user has selected/created an organization
 * Runs after auth.global.ts and onboarding.global.ts
 * Organization creation is now part of onboarding flow
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const { loggedIn, user } = useAuth();

  // Skip if not logged in (auth middleware handles this)
  if (!loggedIn.value) {
    return;
  }

  // Skip if user hasn't completed onboarding (onboarding middleware handles this)
  if (user.value && 'onboardingCompleted' in user.value && !user.value.onboardingCompleted) {
    return;
  }

  // Skip if on onboarding page
  if (to.path === '/onboarding') {
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
  if (to.path.startsWith('/user/')) {
    return;
  }

  // Skip user-level pages (profile, admin, dashboard)
  if (to.path.startsWith('/profile') || to.path.startsWith('/admin') || to.path.startsWith('/dashboard')) {
    return;
  }

  // Skip public routes (blog, legal, docs, etc)
  const config = useRuntimeConfig();
  const publicRoutes = config.public.publicRoutes as string[];
  const isPublicRoute = publicRoutes.some((route) => {
    if (route.endsWith('/*')) {
      const basePath = route.slice(0, -2);
      return to.path === basePath || to.path.startsWith(basePath + '/');
    }
    return to.path === route;
  });

  if (isPublicRoute) {
    return;
  }

  // Check if user has organizations for non-skipped pages
  try {
    const { data } = await useFetch<{ organizations: unknown[] }>('/api/organizations');

    if (!data.value?.organizations) {
      return;
    }

    // If no orgs, redirect to select (which will show create prompt)
    if (data.value.organizations.length === 0) {
      return navigateTo('/organizations/select');
    }

    // If has orgs, redirect to select to choose one
    return navigateTo('/organizations/select');
  } catch {
    // If error fetching orgs, allow navigation
    return;
  }
});
