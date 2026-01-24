import type { User } from '../../../prisma/generated/client';

/**
 * useImpersonation composable
 * Manages impersonation state and provides impersonation methods
 */
export function useImpersonation() {
  const { fetchSession } = useAuth();

  // State
  const isImpersonating = useState('impersonating', () => false);
  const impersonatedUser = useState<User | null>('impersonatedUser', () => null);

  /**
   * Start impersonating a user
   */
  const startImpersonation = async (userId: string, reason?: string) => {
    try {
      await $fetch('/api/admin/impersonate', {
        method: 'POST',
        body: { userId, reason },
      });

      // Refresh session to get impersonated user data
      await fetchSession();

      // Update state
      isImpersonating.value = true;

      return { success: true };
    } catch (err) {
      const error = err as { data?: { message?: string } };
      return {
        success: false,
        error: error.data?.message || 'Failed to start impersonation',
      };
    }
  };

  /**
   * Stop impersonating current user
   */
  const stopImpersonation = async () => {
    try {
      await $fetch('/api/admin/impersonate/stop', {
        method: 'POST',
      });

      // Clear state immediately
      isImpersonating.value = false;
      impersonatedUser.value = null;

      // Force full page reload to ensure session is updated
      // external: true forces full reload, more reliable than client-side navigation
      await navigateTo({ name: 'admin-users' }, { external: true });

      return { success: true };
    } catch (err) {
      const error = err as { data?: { message?: string } };
      return {
        success: false,
        error: error.data?.message || 'Failed to stop impersonation',
      };
    }
  };

  /**
   * Check if currently impersonating
   * Fetches active session from server
   */
  const checkImpersonation = async () => {
    try {
      const response = (await $fetch('/api/admin/impersonate/active')) as {
        active: boolean;
        session: { targetUser?: User } | null;
      };
      isImpersonating.value = response.active;
      if (response.session?.targetUser) {
        impersonatedUser.value = response.session.targetUser;
      }
    } catch {
      // Not impersonating or not authorized
      isImpersonating.value = false;
      impersonatedUser.value = null;
    }
  };

  return {
    isImpersonating,
    impersonatedUser,
    startImpersonation,
    stopImpersonation,
    checkImpersonation,
  };
}
