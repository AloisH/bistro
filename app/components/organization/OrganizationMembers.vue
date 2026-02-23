<script setup lang="ts">
import type { OrganizationMember, OrganizationRole } from '../../../prisma/generated/client';
import { inviteMemberSchema } from '#shared/organization';
import { h, resolveComponent } from 'vue';

interface Props {
  organizationSlug: string;
}

const { organizationSlug } = defineProps<Props>();

const { t } = useI18n();
const toast = useToast();
const { user } = useAuth();
const { members, currentUserRole, canManageMembers, fetchMembers, updateMemberRole, removeMember }
  = useOrganization();

// Fetch members on mount
onMounted(() => fetchMembers(organizationSlug));

const isOwner = computed(() => currentUserRole.value === 'OWNER');

const inviteModalOpen = ref(false);
const removeModalOpen = ref(false);
const memberToRemove = ref<string | null>(null);
const removing = ref(false);
const inviteState = ref({
  email: '',
  role: 'MEMBER' as OrganizationRole,
});
const inviting = ref(false);

const roleColors = {
  OWNER: 'error',
  ADMIN: 'warning',
  MEMBER: 'primary',
  GUEST: 'neutral',
} as const;

const roleIcons = {
  OWNER: 'i-lucide-crown',
  ADMIN: 'i-lucide-shield',
  MEMBER: 'i-lucide-user',
  GUEST: 'i-lucide-eye',
} as const;

const roleLabels = computed(() => ({
  OWNER: t('org.members.roleOwner'),
  ADMIN: t('org.members.roleAdmin'),
  MEMBER: t('org.members.roleMember'),
  GUEST: t('org.members.roleGuest'),
}));

const columns = computed(() => [
  {
    id: 'name',
    accessorKey: 'user.name',
    header: t('org.members.nameHeader'),
    cell: ({
      row,
    }: {
      row: {
        original: OrganizationMember & {
          user: { name: string; email: string; image: string | null };
        };
      };
    }) => {
      const user = row.original.user;
      return h('div', { class: 'flex items-center gap-2' }, [
        h(resolveComponent('UAvatar'), {
          src: user.image || undefined,
          alt: user.name,
          size: 'xs',
        }),
        h('span', user.name),
      ]);
    },
  },
  {
    id: 'email',
    accessorKey: 'user.email',
    header: t('org.members.emailHeader'),
    cell: ({ row }: { row: { original: OrganizationMember & { user: { email: string } } } }) =>
      row.original.user.email,
  },
  {
    id: 'role',
    accessorKey: 'role',
    header: t('org.members.roleHeader'),
    cell: ({ row }: { row: { original: OrganizationMember } }) => {
      return h(
        resolveComponent('UBadge'),
        {
          color: roleColors[row.original.role as keyof typeof roleColors],
          icon: roleIcons[row.original.role as keyof typeof roleIcons],
        },
        () => roleLabels.value[row.original.role as keyof typeof roleLabels.value],
      );
    },
  },
  {
    id: 'actions',
    header: t('org.members.actionsHeader'),
    cell: ({ row }: { row: { original: OrganizationMember & { user: { id: string } } } }) => {
      const member = row.original;
      const currentUserId = user.value?.id;
      const isSelf = member.userId === currentUserId;
      const canEdit = isOwner.value && !isSelf;
      const canRemove = canManageMembers.value && !isSelf;

      return h(
        'div',
        { class: 'flex gap-2' },
        [
          // Role dropdown (OWNER only, not self)
          canEdit
            ? h(resolveComponent('USelect'), {
                'modelValue': member.role,
                'options': [
                  { value: 'OWNER', label: roleLabels.value.OWNER },
                  { value: 'ADMIN', label: roleLabels.value.ADMIN },
                  { value: 'MEMBER', label: roleLabels.value.MEMBER },
                  { value: 'GUEST', label: roleLabels.value.GUEST },
                ],
                'onUpdate:modelValue': (newRole: OrganizationRole) =>
                  handleRoleChange(member.userId, newRole),
              })
            : h(
                resolveComponent('UBadge'),
                {
                  color: roleColors[member.role as keyof typeof roleColors],
                  icon: roleIcons[member.role as keyof typeof roleIcons],
                },
                () => roleLabels.value[member.role as keyof typeof roleLabels.value],
              ),

          // Remove button (OWNER/ADMIN, not self)
          canRemove
            ? h(resolveComponent('UButton'), {
                'icon': 'i-lucide-trash-2',
                'size': 'xs',
                'color': 'error',
                'variant': 'ghost',
                'aria-label': t('org.members.removeTitle'),
                'onClick': () => { openRemoveModal(member.userId); },
              })
            : null,
        ].filter(Boolean),
      );
    },
  },
]);

function openInviteModal() {
  inviteModalOpen.value = true;
  inviteState.value.email = '';
  inviteState.value.role = 'MEMBER';
}

async function sendInvite() {
  inviting.value = true;
  try {
    await $fetch(`/api/organizations/${organizationSlug}/invites`, {
      method: 'POST',
      body: inviteState.value,
    });

    toast.add({
      title: t('common.success'),
      description: t('org.members.toast.inviteSuccess'),
      color: 'success',
      icon: 'i-lucide-check',
    });

    inviteModalOpen.value = false;
  }
  catch (err) {
    const error = err as { data?: { message?: string } };
    toast.add({
      title: t('common.error'),
      description: error.data?.message || t('org.members.toast.inviteError'),
      color: 'error',
      icon: 'i-lucide-alert-triangle',
    });
  }
  finally {
    inviting.value = false;
  }
}

async function handleRoleChange(userId: string, role: OrganizationRole) {
  try {
    await updateMemberRole(organizationSlug, userId, role);
    toast.add({
      title: t('common.success'),
      description: t('org.members.toast.roleSuccess'),
      color: 'success',
      icon: 'i-lucide-check',
    });
  }
  catch (err) {
    const error = err as { data?: { message?: string } };
    toast.add({
      title: t('common.error'),
      description: error.data?.message || t('org.members.toast.roleError'),
      color: 'error',
      icon: 'i-lucide-alert-triangle',
    });
  }
}

function openRemoveModal(userId: string) {
  memberToRemove.value = userId;
  removeModalOpen.value = true;
}

async function confirmRemove() {
  if (!memberToRemove.value)
    return;

  removing.value = true;
  try {
    await removeMember(organizationSlug, memberToRemove.value);
    toast.add({
      title: t('common.success'),
      description: t('org.members.toast.removeSuccess'),
      color: 'success',
      icon: 'i-lucide-check',
    });
    removeModalOpen.value = false;
  }
  catch (err) {
    const error = err as { data?: { message?: string } };
    toast.add({
      title: t('common.error'),
      description: error.data?.message || t('org.members.toast.removeError'),
      color: 'error',
      icon: 'i-lucide-alert-triangle',
    });
  }
  finally {
    removing.value = false;
    memberToRemove.value = null;
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">
        {{ $t('org.members.membersLabel') }}
      </h2>
      <UButton
        v-if="isOwner"
        icon="i-lucide-user-plus"
        @click="openInviteModal"
      >
        {{ $t('org.members.inviteButton') }}
      </UButton>
    </div>

    <UTable
      :data="[...members]"
      :columns="columns"
    />

    <UModal v-model:open="inviteModalOpen">
      <template #content="{ close }">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">
              {{ $t('org.members.inviteTitle') }}
            </h3>
          </template>

          <UForm
            :state="inviteState"
            :schema="inviteMemberSchema"
            @submit.prevent="sendInvite"
          >
            <div class="space-y-4">
              <UFormField
                name="email"
                :label="$t('common.email')"
                required
              >
                <UInput
                  v-model="inviteState.email"
                  type="email"
                  :placeholder="$t('org.members.inviteEmailPlaceholder')"
                />
              </UFormField>

              <UFormField
                name="role"
                :label="$t('org.members.inviteRoleLabel')"
              >
                <USelect
                  v-model="inviteState.role"
                  :options="[
                    { value: 'MEMBER', label: $t('org.members.roleMember') },
                    { value: 'ADMIN', label: $t('org.members.roleAdmin') },
                    { value: 'GUEST', label: $t('org.members.roleGuest') },
                  ]"
                  option-attribute="label"
                  value-attribute="value"
                />
              </UFormField>

              <div class="flex gap-2 pt-4">
                <UButton
                  type="submit"
                  :loading="inviting"
                  block
                >
                  {{ $t('org.members.sendInvitation') }}
                </UButton>
                <UButton
                  variant="ghost"
                  :disabled="inviting"
                  @click="close"
                >
                  {{ $t('common.cancel') }}
                </UButton>
              </div>
            </div>
          </UForm>
        </UCard>
      </template>
    </UModal>

    <UModal v-model:open="removeModalOpen">
      <template #content="{ close }">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">
              {{ $t('org.members.removeTitle') }}
            </h3>
          </template>

          <p>{{ $t('org.members.removeConfirm') }}</p>

          <template #footer>
            <div class="flex gap-2">
              <UButton
                color="error"
                :loading="removing"
                @click="confirmRemove"
              >
                {{ $t('common.remove') }}
              </UButton>
              <UButton
                variant="ghost"
                :disabled="removing"
                @click="close"
              >
                {{ $t('common.cancel') }}
              </UButton>
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>
