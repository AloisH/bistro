export interface OrgInvite {
  id: string;
  email: string;
  role: string;
  organization: {
    id: string;
    name: string;
    slug: string;
    description?: string;
  };
}

export function useOrgInvite(token: string) {
  const router = useRouter();
  const toast = useToast();
  const { t } = useI18n();
  const localePath = useLocalePath();

  const accepting = ref(false);

  // Redirect if no token
  if (!token) {
    void router.push(localePath('/org/select'));
  }

  // Fetch invite data
  const { data: inviteData, error: fetchError } = useFetch<{ invite: OrgInvite }>(
    `/api/organizations/invites/${token}`,
    { key: `invite-${token}` },
  );

  const invite = computed(() => inviteData.value?.invite ?? null);

  async function acceptInvite() {
    if (!invite.value)
      return;

    accepting.value = true;
    try {
      await $fetch('/api/organizations/invites/accept', {
        method: 'POST',
        body: { token },
      });

      toast.add({
        title: t('common.success'),
        description: t('org.invite.toast.success'),
        color: 'success',
        icon: 'i-lucide-check',
      });

      await router.push(localePath(`/org/${invite.value.organization.slug}/dashboard`));
    }
    catch (err) {
      const error = err as { data?: { message?: string } };
      toast.add({
        title: t('common.error'),
        description: error.data?.message || t('org.invite.toast.error'),
        color: 'error',
        icon: 'i-lucide-alert-triangle',
      });
    }
    finally {
      accepting.value = false;
    }
  }

  return {
    invite,
    fetchError,
    accepting,
    acceptInvite,
  };
}
