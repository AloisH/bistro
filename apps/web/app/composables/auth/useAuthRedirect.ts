export const useAuthRedirect = () => {
  const { fetchSession, loggedIn, redirectToUserDashboard } = useAuth();

  onMounted(async () => {
    await fetchSession();
    if (loggedIn.value) {
      await redirectToUserDashboard();
    }
  });
};
