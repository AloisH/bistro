<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
});

const { t } = useI18n();
const { isAdmin } = useRole();
const toast = useToast();

// Permission gate
onMounted(() => {
  if (!isAdmin.value) {
    toast.add({
      title: t('admin.users.toast.accessDenied'),
      description: t('admin.users.toast.accessDeniedDescription'),
      color: 'error',
      icon: 'i-lucide-alert-triangle',
    });
    navigateTo({ name: 'index' });
  }
});

const {
  templates,
  loading,
  error,
  selectedTemplateId,
  viewMode,
  sendingTest,
  selectedTemplate,
  fetchTemplates,
  sendTestEmail,
  selectTemplate,
  setViewMode,
} = useEmailTemplates();

onMounted(fetchTemplates);
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold">
        {{ $t('admin.emailPreview.title') }}
      </h1>
      <p class="text-sm text-neutral-600 dark:text-neutral-400">
        {{ $t('admin.emailPreview.description') }}
      </p>
    </div>

    <UCard v-if="!loading && templates.length > 0">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">
            {{ $t('admin.emailPreview.templatesLabel') }}
          </h2>
          <UBadge color="neutral">
            {{ $t('admin.emailPreview.templateCount', { count: templates.length }) }}
          </UBadge>
        </div>
      </template>

      <div class="space-y-4">
        <AdminEmailTemplateTabs
          :templates="templates"
          :selected-id="selectedTemplateId"
          @select="selectTemplate"
        />

        <AdminEmailTemplatePreview
          v-if="selectedTemplate"
          :template="selectedTemplate"
          :view-mode="viewMode"
          :sending-test="sendingTest"
          @update:view-mode="setViewMode"
          @send-test="sendTestEmail"
        />
      </div>
    </UCard>

    <UCard v-else-if="loading">
      <div class="flex items-center justify-center py-12">
        <div class="text-neutral-600 dark:text-neutral-400">
          {{ $t('admin.emailPreview.loading') }}
        </div>
      </div>
    </UCard>

    <UCard v-else-if="error">
      <UAlert
        color="error"
        icon="i-lucide-alert-triangle"
        :title="error"
        :description="t('admin.emailPreview.loadError')"
      />
    </UCard>
  </div>
</template>
