<script setup lang="ts">
import { createOrganizationSchema } from '#shared/schemas/organization';
import type { CreateOrganizationInput } from '#shared/schemas/organization';

const router = useRouter();
const toast = useToast();

const state = reactive<CreateOrganizationInput>({
  name: '',
  slug: '',
  description: '',
});

const loading = ref(false);

// Auto-generate slug from name
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

watch(
  () => state.name,
  (newName) => {
    if (!state.slug || state.slug === slugify(state.name)) {
      state.slug = slugify(newName);
    }
  },
);

async function onSubmit() {
  loading.value = true;
  try {
    const response = await $fetch<{ organization: { slug: string } }>('/api/organizations', {
      method: 'POST',
      body: state,
    });

    toast.add({
      title: 'Success',
      description: 'Organization created successfully',
      color: 'success',
      icon: 'i-lucide-check',
    });

    await router.push(`/org/${response.organization.slug}/dashboard`);
  } catch (err) {
    const error = err as { data?: { message?: string } };
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to create organization',
      color: 'error',
      icon: 'i-lucide-alert-triangle',
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <UCard class="w-full max-w-md">
      <template #header>
        <h1 class="text-2xl font-bold">
          Create Organization
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Set up your new organization
        </p>
      </template>

      <UForm
        :state="state"
        :schema="createOrganizationSchema"
        @submit="onSubmit"
      >
        <div class="space-y-4">
          <UFormField
            name="name"
            label="Organization Name"
            required
          >
            <UInput
              v-model="state.name"
              placeholder="My Organization"
            />
          </UFormField>

          <UFormField
            name="slug"
            label="URL Slug"
            required
            description="Used in the organization URL"
          >
            <UInput
              v-model="state.slug"
              placeholder="my-organization"
            />
          </UFormField>

          <UFormField
            name="description"
            label="Description"
          >
            <UTextarea
              v-model="state.description"
              placeholder="What does your organization do?"
              :rows="3"
            />
          </UFormField>

          <div class="flex gap-2 pt-4">
            <UButton
              type="submit"
              :loading="loading"
              block
            >
              Create Organization
            </UButton>
            <UButton
              variant="ghost"
              to="/organizations/select"
              :disabled="loading"
            >
              Cancel
            </UButton>
          </div>
        </div>
      </UForm>
    </UCard>
  </div>
</template>
