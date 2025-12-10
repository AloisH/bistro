<template>
  <div>
    <div class="container mx-auto p-8">
      <UCard class="mx-auto max-w-2xl">
        <template #header>
          <h1 class="text-3xl font-bold">Profile Settings</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your account settings</p>
        </template>

        <div class="space-y-6">
          <!-- Profile Information -->
          <div>
            <h2 class="mb-4 text-xl font-semibold">Profile Information</h2>
            <UForm
              :state="profileState"
              :schema="updateProfileSchema"
              @submit="updateProfile"
            >
              <UFormField
                name="name"
                label="Name"
              >
                <UInput
                  v-model="profileState.name"
                  placeholder="Your name"
                />
              </UFormField>

              <UFormField
                name="email"
                label="Email"
                class="mt-4"
                :description="
                  hasPassword
                    ? 'Email address for your account'
                    : 'Managed by your OAuth provider (GitHub/Google)'
                "
              >
                <UInput
                  :model-value="user?.email"
                  disabled
                />
              </UFormField>

              <UButton
                type="submit"
                :loading="profileLoading"
                class="mt-6"
              >
                Save Changes
              </UButton>
            </UForm>
          </div>

          <!-- Change Password (only for password-based accounts) -->
          <div
            v-if="hasPassword"
            class="border-t pt-6 dark:border-gray-700"
          >
            <h2 class="mb-4 text-xl font-semibold">Change Password</h2>
            <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Update your password to keep your account secure
            </p>
            <UForm
              :state="passwordState"
              :schema="changePasswordSchema"
              @submit="changePassword"
            >
              <UFormField
                name="currentPassword"
                label="Current Password"
              >
                <UInput
                  v-model="passwordState.currentPassword"
                  type="password"
                  placeholder="••••••••"
                />
              </UFormField>

              <UFormField
                name="newPassword"
                label="New Password"
                class="mt-4"
              >
                <UInput
                  v-model="passwordState.newPassword"
                  type="password"
                  placeholder="••••••••"
                />
              </UFormField>

              <UFormField
                name="revokeOtherSessions"
                class="mt-4"
              >
                <template #label>
                  <div class="flex items-center gap-2">
                    <input
                      id="revoke-sessions"
                      v-model="passwordState.revokeOtherSessions"
                      type="checkbox"
                      class="rounded"
                    >
                    <label
                      for="revoke-sessions"
                      class="text-sm"
                    >
                      Sign out from all other devices
                    </label>
                  </div>
                </template>
              </UFormField>

              <UButton
                type="submit"
                :loading="passwordLoading"
                class="mt-6"
              >
                Change Password
              </UButton>
            </UForm>
          </div>

          <!-- Danger Zone -->
          <div class="border-t pt-6 dark:border-gray-700">
            <h2 class="mb-4 text-xl font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
            <p class="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Once you delete your account, there is no going back. All your data including projects
              and AI jobs will be permanently deleted.
            </p>
            <UButton
              color="error"
              @click="showDeleteModal = true"
            >
              Delete Account
            </UButton>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Delete Confirmation Modal -->
    <UModal v-model:open="showDeleteModal">
      <template #content>
        <UCard>
          <template #header>
            <h2 class="text-xl font-bold">Confirm Account Deletion</h2>
          </template>

          <div class="space-y-4">
            <UAlert
              color="error"
              variant="subtle"
              title="This action cannot be undone"
              description="All your data will be permanently deleted from our servers."
            />

            <p class="text-sm text-gray-600 dark:text-gray-400">
              The following data will be permanently deleted:
            </p>
            <ul class="list-inside list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>Your user profile</li>
              <li>All your projects</li>
              <li>All AI jobs and their results</li>
              <li>All active sessions</li>
            </ul>

            <UForm
              :state="deleteState"
              :schema="hasPassword ? deleteAccountPasswordSchema : deleteAccountEmailSchema"
              @submit="deleteAccount"
            >
              <UFormField
                v-if="hasPassword"
                name="password"
                label="Enter your password to confirm"
              >
                <UInput
                  v-model="deleteState.password"
                  type="password"
                  placeholder="••••••••"
                />
              </UFormField>

              <UFormField
                v-else
                name="email"
                label="Enter your email to confirm"
              >
                <UInput
                  v-model="deleteState.email"
                  type="email"
                  :placeholder="user?.email"
                />
              </UFormField>

              <div class="mt-6 flex gap-2">
                <UButton
                  color="error"
                  type="submit"
                  :loading="deleteLoading"
                >
                  Delete Forever
                </UButton>
                <UButton
                  variant="ghost"
                  :disabled="deleteLoading"
                  @click="showDeleteModal = false"
                >
                  Cancel
                </UButton>
              </div>
            </UForm>
          </div>
        </UCard>
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
      title: 'Profile updated',
      description: 'Your profile has been updated successfully',
      color: 'success',
      icon: 'i-lucide-check',
    });
  }
  catch (e: unknown) {
    const err = e as { data?: { message?: string } };
    toast.add({
      title: 'Update failed',
      description: err.data?.message || 'Failed to update profile',
      color: 'error',
      icon: 'i-lucide-alert-triangle',
    });
  }
  finally {
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
      title: 'Password changed',
      description: 'Your password has been updated successfully',
      color: 'success',
      icon: 'i-lucide-check',
    });
  }
  catch (e: unknown) {
    const err = e as { message?: string };
    toast.add({
      title: 'Change failed',
      description: err.message || 'Failed to change password',
      color: 'error',
      icon: 'i-lucide-alert-triangle',
    });
  }
  finally {
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
      title: 'Account deleted',
      description: 'Your account has been permanently deleted',
      color: 'success',
      icon: 'i-lucide-check',
    });
    await signOut();
    await router.push('/auth/login');
  }
  catch (e: unknown) {
    const err = e as { data?: { message?: string } };
    toast.add({
      title: 'Deletion failed',
      description: err.data?.message || 'Failed to delete account',
      color: 'error',
      icon: 'i-lucide-alert-triangle',
    });
  }
  finally {
    deleteLoading.value = false;
  }
}
</script>
