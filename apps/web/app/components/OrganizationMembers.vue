<script setup lang="ts">
import type { OrganizationMember, OrganizationRole } from '~/prisma/generated/client';
import { inviteMemberSchema } from '#shared/schemas/organization';

const props = defineProps<{
  organizationSlug: string;
  userRole: OrganizationRole;
}>();

const toast = useToast();

const isOwner = computed(() => props.userRole === 'OWNER');

const { data: membersData } = await useFetch<{
  members: Array<
    OrganizationMember & { user: { id: string; name: string; email: string; image: string | null } }
  >;
}>(`/api/organizations/${props.organizationSlug}/members`);

const members = computed(() => membersData.value?.members || []);

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
      :columns="[
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role' },
      ]"
    >
      <template #name-data="{ row }">
        <div class="flex items-center gap-2">
          <UAvatar
            v-if="row.user.image"
            :src="row.user.image"
            :alt="row.user.name"
            size="xs"
          />
          <UAvatar
            v-else
            :alt="row.user.name"
            size="xs"
          />
          <span>{{ row.user.name }}</span>
        </div>
      </template>

      <template #email-data="{ row }">
        {{ row.user.email }}
      </template>

      <template #role-data="{ row }">
        <UBadge :color="roleColors[row.role]">
          {{ row.role }}
        </UBadge>
      </template>
    </UTable>

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
