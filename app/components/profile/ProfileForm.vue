<script setup lang="ts">
import { updateProfileSchema } from '#shared/user';

interface Props {
  hasPassword: boolean;
}

defineProps<Props>();

const { t } = useI18n();
const { user, fetchSession } = useAuth();
const toast = useToast();

const profileState = ref({
  name: user.value?.name || '',
});
const profileLoading = ref(false);

// Track original value for dirty detection
const originalName = ref(user.value?.name || '');
const isDirty = computed(() => profileState.value.name !== originalName.value);

watch(
  () => user.value?.name,
  (newName) => {
    if (newName) {
      profileState.value.name = newName;
      originalName.value = newName;
    }
  },
);

// Warn on navigation with unsaved changes
onBeforeRouteLeave(() => {
  if (isDirty.value) {
    return window.confirm('You have unsaved changes. Leave anyway?');
  }
});

async function updateProfile() {
  profileLoading.value = true;
  try {
    await $fetch('/api/user/profile', {
      method: 'PUT',
      body: { name: profileState.value.name },
    });
    await fetchSession();
    originalName.value = profileState.value.name; // Reset dirty state
    toast.add({
      title: t('profile.form.toast.success'),
      description: t('profile.form.toast.successDescription'),
      color: 'success',
      icon: 'i-lucide-check-circle',
    });
  }
  catch (e: unknown) {
    toast.add({
      title: t('profile.form.toast.error'),
      description: getErrorMessage(e, 'Failed to update profile. Please try again.'),
      color: 'error',
      icon: 'i-lucide-alert-circle',
    });
  }
  finally {
    profileLoading.value = false;
  }
}
</script>

<template>
  <div class="border-default border-b pb-6">
    <h2 class="mb-6 text-lg font-semibold text-neutral-900 sm:text-xl dark:text-white">
      {{ $t('profile.form.title') }}
    </h2>
    <UForm
      :state="profileState"
      :schema="updateProfileSchema"
      class="space-y-4"
      @submit.prevent="updateProfile"
    >
      <UFormField
        name="name"
        :label="$t('profile.form.nameLabel')"
        :description="$t('profile.form.nameHint')"
      >
        <UInput
          v-model="profileState.name"
          :placeholder="$t('profile.form.namePlaceholder')"
          autocomplete="name"
          size="lg"
          class="w-full"
        />
      </UFormField>

      <UFormField
        name="email"
        :label="$t('profile.form.emailLabel')"
        :description="
          hasPassword
            ? $t('profile.form.emailHint')
            : $t('profile.form.emailOauthHint')
        "
      >
        <UInput
          :model-value="user?.email"
          disabled
          autocomplete="email"
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
          {{ $t('profile.form.saveButton') }}
        </UButton>
      </div>
    </UForm>
  </div>
</template>
