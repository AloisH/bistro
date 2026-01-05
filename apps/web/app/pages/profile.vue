<template>
  <div class="w-full p-4 sm:p-6 lg:p-8">
    <UCard class="mx-auto w-full max-w-4xl">
      <template #header>
        <div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
              Profile Settings
            </h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your account information and preferences
            </p>
          </div>
          <!-- Profile Picture Section -->
          <div class="flex items-center gap-3">
            <UAvatar
              :src="user?.image || undefined"
              :alt="user?.name || 'Profile picture'"
              :text="user?.name ? getInitials(user.name) : 'U'"
              size="xl"
              class="shrink-0 ring-2 ring-gray-200 dark:ring-gray-700"
            />
          </div>
        </div>
      </template>

      <div class="space-y-8">
        <ProfileForm :has-password="hasPassword" />
        <ChangePasswordForm
          v-if="hasPassword"
          @changed="onPasswordChanged"
        />
        <SessionManagement ref="sessionManagement" />
        <OnboardingInfo />
        <RestartOnboardingButton />
        <DeleteAccountSection :has-password="hasPassword" />
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import ProfileForm from '~/components/profile/ProfileForm.vue';
import ChangePasswordForm from '~/components/profile/ChangePasswordForm.vue';
import SessionManagement from '~/components/profile/SessionManagement.vue';
import OnboardingInfo from '~/components/profile/OnboardingInfo.vue';
import RestartOnboardingButton from '~/components/profile/RestartOnboardingButton.vue';
import DeleteAccountSection from '~/components/profile/DeleteAccountSection.vue';

definePageMeta({
  layout: 'dashboard',
});

const { user } = useAuth();

// Fetch full profile with hasPassword flag
const { data: profile } = await useFetch('/api/user/profile');
const hasPassword = computed(() => profile.value?.profile.hasPassword ?? false);

// Ref to SessionManagement component
const sessionManagement = ref<InstanceType<typeof SessionManagement> | null>(null);

// Helper function to get initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('');
}

// Refresh sessions when password changed with revoke option
function onPasswordChanged() {
  sessionManagement.value?.fetchSessions();
}
</script>
