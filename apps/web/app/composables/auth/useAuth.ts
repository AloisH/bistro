import { createAuthClient } from 'better-auth/client';
import { adminClient, magicLinkClient } from 'better-auth/client/plugins';
import type {
  InferSessionFromClient,
  InferUserFromClient,
  ClientOptions,
} from 'better-auth/client';

export const useAuth = () => {
  const url = useRequestURL();
  const headers = import.meta.server ? useRequestHeaders() : undefined;

  const client = createAuthClient({
    baseURL: url.origin,
    fetchOptions: {
      headers,
    },
    plugins: [
      adminClient(), // Access control not needed on client for impersonation
      magicLinkClient(), // Magic link authentication
    ],
  });

  const session = useState<InferSessionFromClient<ClientOptions> | null>(
    'auth:session',
    () => null,
  );
  const user = useState<InferUserFromClient<ClientOptions> | null>('auth:user', () => null);
  const sessionFetching = import.meta.server
    ? ref(false)
    : useState('auth:sessionFetching', () => false);

  const fetchSession = async () => {
    if (sessionFetching.value) {
      return;
    }
    sessionFetching.value = true;
    const { data } = await client.getSession({
      fetchOptions: {
        headers,
      },
    });
    session.value = data?.session || null;
    user.value = data?.user || null;
    sessionFetching.value = false;
    return data;
  };

  if (import.meta.client) {
    client.$store.listen('$sessionSignal', async (signal) => {
      if (!signal) return;
      await fetchSession();
    });
  }

  const redirectToUserDashboard = async () => {
    try {
      const { organizations } = await $fetch<{ organizations: { slug: string }[] }>(
        '/api/organizations',
      );
      const firstOrg = organizations?.[0];
      if (firstOrg) {
        return navigateTo({ name: 'org-slug-dashboard', params: { slug: firstOrg.slug } });
      }
      return navigateTo({ name: 'organizations-create' });
    } catch {
      return navigateTo({ name: 'organizations-create' });
    }
  };

  return {
    session,
    user,
    loggedIn: computed(() => !!session.value),
    isPending: sessionFetching,
    signIn: client.signIn,
    signUp: client.signUp,
    async signOut({ redirectTo }: { redirectTo?: string } = {}) {
      const res = await client.signOut({
        fetchOptions: {
          credentials: 'include',
        },
      });
      session.value = null;
      user.value = null;
      if (redirectTo) {
        // Hard redirect to clear all cached state (including cookieCache)
        if (import.meta.client) {
          window.location.href = redirectTo;
        } else {
          await navigateTo(redirectTo);
        }
      }
      return res;
    },
    fetchSession,
    redirectToUserDashboard,
    client,
  };
};
