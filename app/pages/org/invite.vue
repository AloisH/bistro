<script setup lang="ts">
const localePath = useLocalePath();
const route = useRoute();
const token = route.query.token as string;

const { invite, fetchError, accepting, acceptInvite } = useOrgInvite(token);
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <h1 class="text-2xl font-bold">
          {{ $t('org.invite.title') }}
        </h1>
      </template>

      <div
        v-if="fetchError"
        class="py-8"
      >
        <UAlert
          color="error"
          icon="i-lucide-alert-triangle"
          :title="$t('org.invite.invalidTitle')"
          :description="fetchError.message"
        />
        <UButton
          class="mt-4"
          :to="localePath('/org/select')"
          block
        >
          {{ $t('org.invite.goToOrgs') }}
        </UButton>
      </div>

      <div
        v-else-if="invite"
        class="space-y-6"
      >
        <div class="space-y-4">
          <div>
            <p class="text-sm text-neutral-500 dark:text-neutral-400">
              {{ $t('org.invite.invitedToJoin') }}
            </p>
            <div class="mt-2 flex items-center gap-3">
              <UIcon
                name="i-lucide-building-2"
                class="h-8 w-8 text-neutral-400"
              />
              <div>
                <h2 class="text-xl font-semibold">
                  {{ invite.organization.name }}
                </h2>
                <p
                  v-if="invite.organization.description"
                  class="text-sm text-neutral-500"
                >
                  {{ invite.organization.description }}
                </p>
              </div>
            </div>
          </div>

          <div class="rounded-lg bg-neutral-50 p-4 dark:bg-neutral-800">
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-neutral-500">{{ $t('org.invite.emailLabel') }}</span>
                <span class="font-medium">{{ invite.email }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-neutral-500">{{ $t('org.invite.roleLabel') }}</span>
                <span class="font-medium">{{ invite.role }}</span>
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
            {{ $t('org.invite.acceptButton') }}
          </UButton>
          <UButton
            variant="ghost"
            :to="localePath('/org/select')"
            :disabled="accepting"
          >
            {{ $t('org.invite.declineButton') }}
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>
