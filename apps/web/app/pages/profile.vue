<template>
  <div>
    <div class="container mx-auto p-4 sm:p-6 lg:p-8">
      <UCard class="mx-auto max-w-4xl w-full">
        <template #header>
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your account information and preferences</p>
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
          <div class="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h2 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-6">Profile Information</h2>
            <UForm
              :state="profileState"
              :schema="updateProfileSchema"
              class="space-y-4"
              @submit="updateProfile"
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
            class="border-b border-gray-200 dark:border-gray-700 pb-6"
          >
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h2 class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Change Password</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Update your password to keep your account secure
                </p>
              </div>
              <UBadge
                color="gray"
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
              @submit="changePassword"
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
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
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

          <!-- Danger Zone -->
          <div class="pb-6">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h2 class="text-lg sm:text-xl font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Once you delete your account, there is no going back. All your data including projects
                  and AI jobs will be permanently deleted.
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
    </div>

    <!-- Delete Confirmation Modal -->
    <UModal
      v-model:open="showDeleteModal"
      title="Confirm Account Deletion"
      description="This action cannot be undone. All your data will be permanently deleted."
      :ui="{
        footer: { base: 'flex flex-col sm:flex-row gap-3 w-full' },
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
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
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
        <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:ml-auto">
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

// Delete account state
const showDeleteModal = ref(false);
const deleteState = reactive({
  password: '',
  email: '',
});
const deleteLoading = ref(false);

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
</script>
