export const useAuthRedirect = () => {
  const { fetchSession, loggedIn } = useAuth()

  onMounted(async () => {
    await fetchSession()
    if (loggedIn.value) {
      await navigateTo('/dashboard')
    }
  })
}
