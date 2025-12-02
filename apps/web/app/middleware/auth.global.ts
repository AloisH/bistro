export default defineNuxtRouteMiddleware(async (to) => {
  // Public routes that don't require authentication
  const publicRoutes = ['/', '/auth/login', '/auth/register']

  // Allow access to public routes
  if (publicRoutes.includes(to.path)) {
    return
  }

  // Check if user is authenticated
  const { session } = useAuth()

  // Redirect to login if not authenticated
  if (!session || !session.value) {
    return navigateTo('/auth/login')
  }
})
