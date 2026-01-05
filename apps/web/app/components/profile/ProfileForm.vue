<template>
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
</template>

<script setup lang="ts">
import { updateProfileSchema } from '#shared/user';

defineProps<{
  hasPassword: boolean;
}>();

const { user, fetchSession } = useAuth();
const toast = useToast();

const profileState = reactive({
  name: user.value?.name || '',
});
const profileLoading = ref(false);

watch(
  () => user.value?.name,
  (newName) => {
    if (newName) {
      profileState.name = newName;
    }
  },
);

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
</script>
