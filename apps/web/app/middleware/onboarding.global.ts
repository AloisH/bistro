export default defineNuxtRouteMiddleware(async (to) => {
  // Skip if already on onboarding page
  if (to.path === '/onboarding') {
    return;
  }

  // Skip for public routes
  const config = useRuntimeConfig();
  const publicRoutes = config.public.publicRoutes as string[];
  if (publicRoutes.includes(to.path)) {
    return;
  }

  // Check user onboarding status
  const { user, fetchSession } = useAuth();
  await fetchSession();

  // Only redirect authenticated users who haven't completed onboarding
  // User type from Better Auth doesn't include custom fields, so we need to check it exists first
  if (user.value && 'onboardingCompleted' in user.value && !user.value.onboardingCompleted) {
    return navigateTo('/onboarding');
  }
});
