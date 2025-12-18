<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});

const route = useRoute();
const router = useRouter();
const toast = useToast();

const token = route.query.token as string;

if (!token) {
  await router.push('/organizations/select');
}

const { data: inviteData, error: fetchError } = await useFetch(`/api/organizations/invites/${token}`);

const accepting = ref(false);

async function acceptInvite() {
  accepting.value = true;
  try {
    await $fetch('/api/organizations/invites/accept', {
      method: 'POST',
      body: { token },
    });

    toast.add({
      title: 'Success',
      description: 'You have joined the organization',
      color: 'success',
      icon: 'i-lucide-check',
    });

    await router.push(`/org/${inviteData.value?.invite.organization.slug}/dashboard`);
  } catch (err) {
    const error = err as { data?: { message?: string } };
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to accept invite',
      color: 'error',
      icon: 'i-lucide-alert-triangle',
    });
  } finally {
    accepting.value = false;
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <h1 class="text-2xl font-bold">
          Organization Invitation
        </h1>
      </template>

      <div
        v-if="fetchError"
        class="py-8"
      >
        <UAlert
          color="error"
          icon="i-lucide-alert-triangle"
          title="Invalid Invitation"
          :description="fetchError.message"
        />
        <UButton
          class="mt-4"
          to="/organizations/select"
          block
        >
          Go to Organizations
        </UButton>
      </div>

      <div
        v-else-if="inviteData?.invite"
        class="space-y-6"
      >
        <div class="space-y-4">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              You have been invited to join
            </p>
            <div class="mt-2 flex items-center gap-3">
              <UIcon
                name="i-lucide-building-2"
                class="h-8 w-8 text-gray-400"
              />
              <div>
                <h2 class="text-xl font-semibold">
                  {{ inviteData.invite.organization.name }}
                </h2>
                <p
                  v-if="inviteData.invite.organization.description"
                  class="text-sm text-gray-500"
                >
                  {{ inviteData.invite.organization.description }}
                </p>
              </div>
            </div>
          </div>

          <div class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-500">Email:</span>
                <span class="font-medium">{{ inviteData.invite.email }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-500">Role:</span>
                <span class="font-medium">{{ inviteData.invite.role }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex gap-2">
          <UButton
            :loading="accepting"
            block
            @click="acceptInvite"
          >
            Accept Invitation
          </UButton>
          <UButton
            variant="ghost"
            to="/organizations/select"
            :disabled="accepting"
          >
            Decline
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>
