<script setup lang="ts">
import type { OrganizationMember, OrganizationRole } from '~/prisma/generated/client';
import { inviteMemberSchema } from '#shared/schemas/organization';
import { h } from 'vue';

const props = defineProps<{
  organizationSlug: string;
}>();

const toast = useToast();

const { data: membersData } = await useFetch<{
  members: Array<
    OrganizationMember & { user: { id: string; name: string; email: string; image: string | null } }
  >;
  currentUserRole: OrganizationRole;
}>(`/api/organizations/${props.organizationSlug}/members`);

const members = computed(() => membersData.value?.members || []);
const isOwner = computed(() => membersData.value?.currentUserRole === 'OWNER');

const inviteModalOpen = ref(false);
const inviteState = reactive({
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

const columns = [
  {
    id: 'name',
    accessorKey: 'user.name',
    header: 'Name',
    cell: ({ row }: { row: { original: OrganizationMember & { user: { name: string; email: string; image: string | null } } } }) => {
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
    header: 'Email',
    cell: ({ row }: { row: { original: OrganizationMember & { user: { email: string } } } }) => row.original.user.email,
  },
  {
    id: 'role',
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }: { row: { original: OrganizationMember } }) => {
      return h(resolveComponent('UBadge'), {
        color: roleColors[row.original.role],
      }, () => row.original.role);
    },
  },
];

async function openInviteModal() {
  inviteModalOpen.value = true;
  inviteState.email = '';
  inviteState.role = 'MEMBER';
}

async function sendInvite() {
  inviting.value = true;
  try {
    await $fetch(`/api/organizations/${props.organizationSlug}/invites`, {
      method: 'POST',
      body: inviteState,
    });

    toast.add({
      title: 'Success',
      description: 'Invitation sent',
      color: 'success',
      icon: 'i-lucide-check',
    });

    inviteModalOpen.value = false;
  } catch (err) {
    const error = err as { data?: { message?: string } };
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to send invite',
      color: 'error',
      icon: 'i-lucide-alert-triangle',
    });
  } finally {
    inviting.value = false;
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">
        Members
      </h2>
      <UButton
        v-if="isOwner"
        icon="i-lucide-user-plus"
        @click="openInviteModal"
      >
        Invite Member
      </UButton>
    </div>

    <UTable
      :rows="members"
      :columns="columns"
    />

    <UModal v-model:open="inviteModalOpen">
      <template #content="{ close }">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">
              Invite Member
            </h3>
          </template>

          <UForm
            :state="inviteState"
            :schema="inviteMemberSchema"
            @submit="sendInvite"
          >
            <div class="space-y-4">
              <UFormField
                name="email"
                label="Email"
                required
              >
                <UInput
                  v-model="inviteState.email"
                  type="email"
                  placeholder="member@example.com"
                />
              </UFormField>

              <UFormField
                name="role"
                label="Role"
              >
                <USelect
                  v-model="inviteState.role"
                  :options="[
                    { value: 'MEMBER', label: 'Member' },
                    { value: 'ADMIN', label: 'Admin' },
                    { value: 'GUEST', label: 'Guest' },
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
                  Send Invitation
                </UButton>
                <UButton
                  variant="ghost"
                  :disabled="inviting"
                  @click="close"
                >
                  Cancel
                </UButton>
              </div>
            </div>
          </UForm>
        </UCard>
      </template>
    </UModal>
  </div>
</template>
