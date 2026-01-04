import type { Organization, OrganizationMember, OrganizationRole } from '../../prisma/generated/client';

type MemberWithUser = OrganizationMember & {
  user: { id: string; name: string; email: string; image: string | null };
};

export const useOrganization = () => {
  // State - SSR-safe with useState
  const organizations = useState<Organization[]>('org:list', () => []);
  const members = useState<MemberWithUser[]>('org:members', () => []);
  const currentUserRole = useState<OrganizationRole | null>('org:currentUserRole', () => null);
  const fetching = useState('org:fetching', () => false);
  const switching = useState('org:switching', () => false);

  // Get route + auth
  const route = useRoute();
  const router = useRouter();

  // Computed - derive from state
  const currentOrgSlug = computed(() => route.params.slug as string);
  const currentOrgId = computed(() => currentOrganization.value?.id ?? null);

  const currentOrganization = computed(() =>
    organizations.value.find(org => org.slug === currentOrgSlug.value),
  );

  const canManageMembers = computed(() =>
    ['OWNER', 'ADMIN'].includes(currentUserRole.value ?? ''),
  );

  const canDeleteOrg = computed(() => currentUserRole.value === 'OWNER');

  // Methods - API calls
  async function fetchOrganizations() {
    try {
      fetching.value = true;
      const data = await $fetch<{ organizations: Organization[] }>('/api/organizations');
      organizations.value = data?.organizations ?? [];
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
      organizations.value = [];
    } finally {
      fetching.value = false;
    }
  }

  async function fetchMembers(slug: string) {
    try {
      fetching.value = true;
      const data = await $fetch<{ members: MemberWithUser[]; currentUserRole: OrganizationRole }>(
        `/api/organizations/${slug}/members`,
      );
      members.value = data?.members ?? [];
      currentUserRole.value = data?.currentUserRole ?? null;
    } catch (error) {
      console.error('Failed to fetch members:', error);
      members.value = [];
      currentUserRole.value = null;
    } finally {
      fetching.value = false;
    }
  }

  async function switchOrganization(slug: string) {
    if (slug === currentOrgSlug.value) return;

    try {
      switching.value = true;
      await router.push(`/org/${slug}/dashboard`);
    } finally {
      switching.value = false;
    }
  }

  async function updateMemberRole(slug: string, userId: string, role: OrganizationRole) {
    try {
      await $fetch(`/api/organizations/${slug}/members/${userId}/role`, {
        method: 'PUT',
        body: { role },
      });
      await fetchMembers(slug);
    } catch (error) {
      console.error('Failed to update member role:', error);
      throw error;
    }
  }

  async function removeMember(slug: string, userId: string) {
    try {
      await $fetch(`/api/organizations/${slug}/members/${userId}`, {
        method: 'DELETE',
      });
      await fetchMembers(slug);
    } catch (error) {
      console.error('Failed to remove member:', error);
      throw error;
    }
  }

  return {
    // State
    organizations: readonly(organizations),
    members: readonly(members),
    currentOrganization,
    currentOrgSlug,
    currentOrgId,

    // Permissions
    currentUserRole,
    canManageMembers,
    canDeleteOrg,

    // Methods
    fetchOrganizations,
    fetchMembers,
    switchOrganization,
    updateMemberRole,
    removeMember,

    // Status
    fetching: readonly(fetching),
    switching: readonly(switching),
  };
};
