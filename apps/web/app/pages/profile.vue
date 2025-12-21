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
          <!-- Profile Picture Section - Simplified and Elegant -->
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
        <!-- Profile Information -->
        <div class="border-b border-gray-200 pb-6 dark:border-gray-700">
          <h2 class="mb-6 text-lg font-semibold text-gray-900 sm:text-xl dark:text-white">
            Profile Information
          </h2>
          <UForm
            :state="profileState"
            :schema="updateProfileSchema"
            class="space-y-4"
            @submit.prevent="updateProfile"
          >
            <UFormField
              name="name"
              label="Full Name"
              description="Your display name that appears on your profile"
            >
              <UInput
                v-model="profileState.name"
                placeholder="Your full name"
                size="lg"
                class="w-full"
              />
            </UFormField>

            <UFormField
              name="email"
              label="Email Address"
              :description="
                hasPassword
                  ? 'Your account email address'
                  : 'Managed by your OAuth provider (GitHub/Google)'
              "
            >
              <UInput
                :model-value="user?.email"
                disabled
                size="lg"
                class="w-full"
              />
            </UFormField>

            <div class="pt-4">
              <UButton
                type="submit"
                :loading="profileLoading"
                size="lg"
                class="w-full sm:w-auto"
              >
                <template #leading>
                  <UIcon
                    v-if="!profileLoading"
                    name="i-lucide-save"
                    class="mr-2"
                  />
                </template>
                Save Changes
              </UButton>
            </div>
          </UForm>
        </div>

        <!-- Change Password (only for password-based accounts) -->
        <div
          v-if="hasPassword"
          class="border-b border-gray-200 pb-6 dark:border-gray-700"
        >
          <div class="mb-6 flex flex-col items-start justify-between sm:flex-row sm:items-center">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 sm:text-xl dark:text-white">
                Change Password
              </h2>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Update your password to keep your account secure
              </p>
            </div>
            <UBadge
              color="neutral"
              variant="subtle"
              class="mt-2 sm:mt-0"
            >
              Security
            </UBadge>
          </div>
          <UForm
            :state="passwordState"
            :schema="changePasswordSchema"
            class="space-y-4"
            @submit.prevent="changePassword"
          >
            <UFormField
              name="currentPassword"
              label="Current Password"
              description="Enter your current password for verification"
            >
              <UInput
                v-model="passwordState.currentPassword"
                type="password"
                placeholder="••••••••"
                size="lg"
              />
            </UFormField>

            <UFormField
              name="newPassword"
              label="New Password"
              description="Choose a strong password with at least 8 characters"
            >
              <UInput
                v-model="passwordState.newPassword"
                type="password"
                placeholder="••••••••"
                size="lg"
              />
            </UFormField>

            <UFormField
              name="revokeOtherSessions"
              class="pt-2"
            >
              <template #label>
                <div class="flex items-center gap-3">
                  <UCheckbox
                    id="revoke-sessions"
                    v-model="passwordState.revokeOtherSessions"
                  />
                  <label
                    for="revoke-sessions"
                    class="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Sign out from all other devices
                  </label>
                </div>
              </template>
              <template #description>
                <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Recommended for security when changing passwords
                </p>
              </template>
            </UFormField>

            <div class="pt-4">
              <UButton
                type="submit"
                :loading="passwordLoading"
                size="lg"
                color="primary"
                class="w-full sm:w-auto"
              >
                <template #leading>
                  <UIcon
                    v-if="!passwordLoading"
                    name="i-lucide-lock"
                    class="mr-2"
                  />
                </template>
                Update Password
              </UButton>
            </div>
          </UForm>
        </div>

        <!-- Active Sessions -->
        <div class="border-b border-gray-200 pb-6 dark:border-gray-700">
          <div
            class="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center"
          >
            <div class="flex-1">
              <div class="mb-1 flex items-center gap-2">
                <h2 class="text-lg font-semibold text-gray-900 sm:text-xl dark:text-white">
                  Active Sessions
                </h2>
                <UBadge
                  color="primary"
                  variant="subtle"
                  size="sm"
                >
                  Security
                </UBadge>
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Manage devices where you're currently logged in
              </p>
            </div>
          </div>

          <SessionList
            :sessions="sessions"
            :loading="sessionsLoading || revokeLoading"
            @revoke="revokeSession"
          />

          <div
            v-if="sessions.length > 1"
            class="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700"
          >
            <UButton
              color="error"
              variant="outline"
              size="lg"
              class="w-full sm:w-auto"
              @click="showRevokeAllModal = true"
            >
              <template #leading>
                <UIcon
                  name="i-lucide-log-out"
                  class="mr-2"
                />
              </template>
              Revoke All Other Sessions
            </UButton>
          </div>
        </div>

        <!-- Onboarding Information -->
        <div class="border-b border-gray-200 pb-6 dark:border-gray-700">
          <div class="mb-6">
            <h2 class="text-lg font-semibold text-gray-900 sm:text-xl dark:text-white">
              Onboarding Information
            </h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Information collected during your initial setup
            </p>
          </div>

          <div class="space-y-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <!-- Bio -->
              <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div class="flex items-start gap-3">
                  <UIcon
                    name="i-lucide-user"
                    class="text-primary mt-0.5 h-5 w-5 shrink-0"
                  />
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Bio
                    </p>
                    <p class="mt-1 text-sm text-gray-900 dark:text-white">
                      {{ (user as any)?.bio || 'Not provided' }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Company -->
              <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div class="flex items-start gap-3">
                  <UIcon
                    name="i-lucide-briefcase"
                    class="text-primary mt-0.5 h-5 w-5 shrink-0"
                  />
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Company
                    </p>
                    <p class="mt-1 text-sm text-gray-900 dark:text-white">
                      {{ (user as any)?.company || 'Not provided' }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Use Case -->
              <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div class="flex items-start gap-3">
                  <UIcon
                    name="i-lucide-target"
                    class="text-primary mt-0.5 h-5 w-5 shrink-0"
                  />
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Use Case
                    </p>
                    <p class="mt-1 text-sm capitalize text-gray-900 dark:text-white">
                      {{ (user as any)?.useCase || 'Not provided' }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Email Notifications -->
              <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div class="flex items-start gap-3">
                  <UIcon
                    name="i-lucide-mail"
                    class="text-primary mt-0.5 h-5 w-5 shrink-0"
                  />
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Notifications
                    </p>
                    <p class="mt-1 text-sm text-gray-900 dark:text-white">
                      {{ (user as any)?.emailNotifications ? 'Enabled' : 'Disabled' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Restart Onboarding -->
        <div class="border-b border-gray-200 pb-6 dark:border-gray-700">
          <div class="mb-6 flex flex-col items-start justify-between sm:flex-row sm:items-center">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 sm:text-xl dark:text-white">
                Restart Onboarding
              </h2>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Go through the setup wizard again to update your preferences
              </p>
            </div>
          </div>
          <UButton
            color="neutral"
            variant="outline"
            size="lg"
            class="w-full sm:w-auto"
            :loading="restartOnboardingLoading"
            @click="restartOnboarding"
          >
            <template #leading>
              <UIcon
                v-if="!restartOnboardingLoading"
                name="i-lucide-refresh-cw"
                class="mr-2"
              />
            </template>
            Restart Onboarding
          </UButton>
        </div>

        <!-- Danger Zone -->
        <div class="pb-6">
          <div class="mb-6 flex flex-col items-start justify-between sm:flex-row sm:items-center">
            <div>
              <h2 class="text-lg font-semibold text-red-600 sm:text-xl dark:text-red-400">
                Danger Zone
              </h2>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Once you delete your account, there is no going back. All your data will be
                permanently deleted.
              </p>
            </div>
          </div>
          <UButton
            color="error"
            variant="solid"
            size="lg"
            class="w-full sm:w-auto"
            @click="showDeleteModal = true"
          >
            <template #leading>
              <UIcon
                name="i-lucide-trash-2"
                class="mr-2"
              />
            </template>
            Delete Account
          </UButton>
        </div>
      </div>
    </UCard>

    <!-- Revoke All Sessions Modal -->
    <UModal
      v-model:open="showRevokeAllModal"
      title="Revoke All Other Sessions?"
      description="You will be signed out from all devices except this one."
      :ui="{
        footer: 'flex flex-col sm:flex-row gap-3 w-full',
      }"
    >
      <template #body>
        <div class="space-y-4">
          <UAlert
            color="warning"
            variant="subtle"
            title="Security Action"
            description="This will sign you out from all other devices. You'll need to log in again on those devices."
          />
        </div>
      </template>

      <template #footer="{ close }">
        <div class="flex w-full flex-col gap-3 sm:ml-auto sm:w-auto sm:flex-row">
          <UButton
            variant="ghost"
            :disabled="revokeLoading"
            size="lg"
            class="w-full sm:w-auto"
            @click="close"
          >
            Cancel
          </UButton>
          <UButton
            color="error"
            type="submit"
            :loading="revokeLoading"
            size="lg"
            class="w-full sm:w-auto"
            @click="revokeAllOthers"
          >
            <template #leading>
              <UIcon
                v-if="!revokeLoading"
                name="i-lucide-log-out"
                class="mr-2"
              />
            </template>
            Revoke All Sessions
          </UButton>
        </div>
      </template>
    </UModal>

    <!-- Delete Confirmation Modal -->
    <UModal
      v-model:open="showDeleteModal"
      title="Confirm Account Deletion"
      description="This action cannot be undone. All your data will be permanently deleted."
      :ui="{
        footer: 'flex flex-col sm:flex-row gap-3 w-full',
      }"
    >
      <template #body>
        <div class="space-y-4">
          <UAlert
            color="error"
            variant="subtle"
            title="Irreversible Action"
            description="Once deleted, your account and all associated data cannot be recovered."
            class="mb-4"
          />

          <div>
            <p class="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              The following data will be permanently deleted:
            </p>
            <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li class="flex items-start gap-2">
                <UIcon
                  name="i-lucide-user"
                  class="mt-1 text-gray-400 dark:text-gray-500"
                />
                <span>Your user profile and account information</span>
              </li>
              <li class="flex items-start gap-2">
                <UIcon
                  name="i-lucide-folder"
                  class="mt-1 text-gray-400 dark:text-gray-500"
                />
                <span>All your projects and their configurations</span>
              </li>
              <li class="flex items-start gap-2">
                <UIcon
                  name="i-lucide-bot"
                  class="mt-1 text-gray-400 dark:text-gray-500"
                />
                <span>All AI jobs and their results</span>
              </li>
              <li class="flex items-start gap-2">
                <UIcon
                  name="i-lucide-globe"
                  class="mt-1 text-gray-400 dark:text-gray-500"
                />
                <span>All active sessions across devices</span>
              </li>
            </ul>
          </div>

          <UForm
            :state="deleteState"
            :schema="hasPassword ? deleteAccountPasswordSchema : deleteAccountEmailSchema"
            class="space-y-4"
          >
            <UFormField
              v-if="hasPassword"
              name="password"
              label="Enter your password to confirm"
              description="This is required for security verification"
            >
              <UInput
                v-model="deleteState.password"
                type="password"
                placeholder="••••••••"
                size="lg"
              />
            </UFormField>

            <UFormField
              v-else
              name="email"
              label="Enter your email to confirm"
              description="Enter your account email address"
            >
              <UInput
                v-model="deleteState.email"
                type="email"
                :placeholder="user?.email"
                size="lg"
              />
            </UFormField>
          </UForm>
        </div>
      </template>

      <template #footer="{ close }">
        <div class="flex w-full flex-col gap-3 sm:ml-auto sm:w-auto sm:flex-row">
          <UButton
            variant="ghost"
            :disabled="deleteLoading"
            size="lg"
            class="w-full sm:w-auto"
            @click="close"
          >
            Cancel
          </UButton>
          <UButton
            color="error"
            type="submit"
            :loading="deleteLoading"
            size="lg"
            class="w-full sm:w-auto"
            @click="deleteAccount"
          >
            <template #leading>
              <UIcon
                v-if="!deleteLoading"
                name="i-lucide-trash-2"
                class="mr-2"
              />
            </template>
            Delete Forever
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import {
  updateProfileSchema,
  changePasswordSchema,
  deleteAccountPasswordSchema,
  deleteAccountEmailSchema,
} from '#shared/schemas/user';

definePageMeta({
  layout: 'dashboard',
});

const { user, client, signOut, fetchSession } = useAuth();
const router = useRouter();
const toast = useToast();

// Fetch full profile with hasPassword flag
const { data: profile } = await useFetch('/api/user/profile');
const hasPassword = computed(() => profile.value?.profile.hasPassword ?? false);

// Profile update state
const profileState = reactive({
  name: user.value?.name || '',
});
const profileLoading = ref(false);

// Password change state
const passwordState = reactive({
  currentPassword: '',
  newPassword: '',
  revokeOtherSessions: true,
});
const passwordLoading = ref(false);

// Sessions state
interface SessionWithMetadata {
  id: string;
  isCurrent: boolean;
  browser: string;
  os: string;
  device: string;
  ipAddress: string | null;
  createdAt: Date;
  lastActive: Date;
}

const sessions = ref<SessionWithMetadata[]>([]);
const sessionsLoading = ref(false);
const revokeLoading = ref(false);
const showRevokeAllModal = ref(false);

// Delete account state
const showDeleteModal = ref(false);
const deleteState = reactive({
  password: '',
  email: '',
});
const deleteLoading = ref(false);

// Restart onboarding state
const restartOnboardingLoading = ref(false);

// Helper function to get initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('');
}

// Update profile name when user data changes
watch(
  () => user.value?.name,
  (newName) => {
    if (newName) {
      profileState.name = newName;
    }
  },
);

// Fetch sessions on mount
onMounted(() => {
  fetchSessions();
});

// Update profile
async function updateProfile() {
  profileLoading.value = true;
  try {
    await $fetch('/api/user/profile', {
      method: 'PUT',
      body: { name: profileState.name },
    });
    await fetchSession();
    toast.add({
      title: 'Profile Updated',
      description: 'Your profile information has been saved successfully',
      color: 'success',
      icon: 'i-lucide-check-circle',
    });
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } };
    toast.add({
      title: 'Update Failed',
      description: err.data?.message || 'Failed to update profile. Please try again.',
      color: 'error',
      icon: 'i-lucide-alert-circle',
    });
  } finally {
    profileLoading.value = false;
  }
}

// Change password
async function changePassword() {
  passwordLoading.value = true;
  try {
    await client.changePassword({
      currentPassword: passwordState.currentPassword,
      newPassword: passwordState.newPassword,
      revokeOtherSessions: passwordState.revokeOtherSessions,
    });
    passwordState.currentPassword = '';
    passwordState.newPassword = '';
    toast.add({
      title: 'Password Updated',
      description: 'Your password has been changed successfully',
      color: 'success',
      icon: 'i-lucide-check-circle',
    });
    // Refresh sessions if other sessions were revoked
    if (passwordState.revokeOtherSessions) {
      await fetchSessions();
    }
  } catch (e: unknown) {
    const err = e as { message?: string };
    toast.add({
      title: 'Password Change Failed',
      description: err.message || 'Failed to change password. Please check your current password.',
      color: 'error',
      icon: 'i-lucide-alert-circle',
    });
  } finally {
    passwordLoading.value = false;
  }
}

// Fetch sessions
async function fetchSessions() {
  sessionsLoading.value = true;
  try {
    const data = await $fetch('/api/user/sessions');
    sessions.value = data.sessions.map(
      (
        s: Omit<SessionWithMetadata, 'createdAt' | 'lastActive'> & {
          createdAt: string;
          lastActive: string;
        },
      ) => ({
        ...s,
        createdAt: new Date(s.createdAt),
        lastActive: new Date(s.lastActive),
      }),
    );
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } };
    toast.add({
      title: 'Failed to Load Sessions',
      description: err.data?.message || 'Could not load active sessions',
      color: 'error',
      icon: 'i-lucide-alert-circle',
    });
  } finally {
    sessionsLoading.value = false;
  }
}

// Revoke single session
async function revokeSession(sessionId: string) {
  revokeLoading.value = true;
  try {
    await $fetch(`/api/user/sessions/${sessionId}`, {
      method: 'DELETE',
    });
    await fetchSessions();
    toast.add({
      title: 'Session Revoked',
      description: 'The session has been successfully revoked',
      color: 'success',
      icon: 'i-lucide-check-circle',
    });
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } };
    toast.add({
      title: 'Failed to Revoke Session',
      description: err.data?.message || 'Could not revoke the session',
      color: 'error',
      icon: 'i-lucide-alert-circle',
    });
  } finally {
    revokeLoading.value = false;
  }
}

// Revoke all other sessions
async function revokeAllOthers() {
  revokeLoading.value = true;
  try {
    const data = await $fetch('/api/user/sessions/revoke-others', {
      method: 'POST',
    });
    await fetchSessions();
    showRevokeAllModal.value = false;
    const count = data.count;
    toast.add({
      title: 'Sessions Revoked',
      description: `Successfully revoked ${count} session${count !== 1 ? 's' : ''}`,
      color: 'success',
      icon: 'i-lucide-check-circle',
    });
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } };
    toast.add({
      title: 'Failed to Revoke Sessions',
      description: err.data?.message || 'Could not revoke sessions',
      color: 'error',
      icon: 'i-lucide-alert-circle',
    });
  } finally {
    revokeLoading.value = false;
  }
}

// Delete account
async function deleteAccount() {
  deleteLoading.value = true;
  try {
    const body = hasPassword.value
      ? { password: deleteState.password }
      : { email: deleteState.email };

    await $fetch('/api/user/account', {
      method: 'DELETE',
      body,
    });
    toast.add({
      title: 'Account Deleted',
      description: 'Your account has been permanently deleted',
      color: 'success',
      icon: 'i-lucide-check-circle',
    });
    await signOut();
    await router.push('/auth/login');
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } };
    toast.add({
      title: 'Deletion Failed',
      description: err.data?.message || 'Failed to delete account. Please verify your credentials.',
      color: 'error',
      icon: 'i-lucide-alert-circle',
    });
  } finally {
    deleteLoading.value = false;
  }
}

// Restart onboarding
async function restartOnboarding() {
  restartOnboardingLoading.value = true;
  try {
    // Reset onboardingCompleted to false
    await $fetch('/api/user/onboarding/restart', {
      method: 'POST',
    });

    // Clear localStorage
    localStorage.removeItem('bistro:onboarding');

    // Fetch updated session
    await fetchSession();

    // Redirect to onboarding
    await router.push('/onboarding');

    toast.add({
      title: 'Restarting onboarding',
      description: 'Taking you to the setup wizard',
      color: 'success',
      icon: 'i-lucide-refresh-cw',
    });
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } };
    toast.add({
      title: 'Error',
      description: err.data?.message || 'Failed to restart onboarding',
      color: 'error',
      icon: 'i-lucide-alert-circle',
    });
  } finally {
    restartOnboardingLoading.value = false;
  }
}
</script>
