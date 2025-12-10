export default defineNuxtRouteMiddleware(async (to) => {
  // Public routes centralized in nuxt.config.ts
  const config = useRuntimeConfig();
  const publicRoutes = config.public.publicRoutes as string[];

  // Allow access to public routes
  if (publicRoutes.includes(to.path)) {
    return;
  }

  // Check if user is authenticated
  const { session, fetchSession } = useAuth();
  await fetchSession();

  // Redirect to login if not authenticated
  if (!session.value) {
    return navigateTo('/auth/login');
  }
});
