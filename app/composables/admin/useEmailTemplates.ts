export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  html: string;
  text: string;
  props: Record<string, unknown>;
}

export function useEmailTemplates() {
  const toast = useToast();
  const { user } = useAuth();
  const { t } = useI18n();

  // State
  const templates = ref<EmailTemplate[]>([]);
  const loading = ref(true);
  const error = ref('');
  const selectedTemplateId = ref('verify-email');
  const viewMode = ref<'html' | 'text'>('html');
  const sendingTest = ref(false);

  // Computed
  const selectedTemplate = computed(() =>
    templates.value.find(t => t.id === selectedTemplateId.value),
  );

  // Actions
  async function fetchTemplates() {
    loading.value = true;
    error.value = '';
    try {
      const response = await $fetch('/api/admin/email-preview');
      templates.value = response.templates;
    }
    catch (err) {
      const apiError = err as { data?: { message?: string } };
      error.value = apiError.data?.message || t('admin.emailPreview.toast.loadError');
      toast.add({
        title: t('common.error'),
        description: error.value,
        color: 'error',
        icon: 'i-lucide-alert-triangle',
      });
    }
    finally {
      loading.value = false;
    }
  }

  async function sendTestEmail() {
    if (!selectedTemplate.value)
      return;

    sendingTest.value = true;
    try {
      await $fetch('/api/admin/email-preview/send-test', {
        method: 'POST',
        body: { templateId: selectedTemplate.value.id },
      });

      toast.add({
        title: t('admin.emailPreview.toast.sendSuccess'),
        description: t('admin.emailPreview.toast.sendSuccessDescription', { email: user.value?.email }),
        color: 'success',
        icon: 'i-lucide-check',
      });
    }
    catch (err) {
      const apiError = err as { data?: { message?: string } };
      const errorMessage = apiError.data?.message || 'Failed to send test email';

      if (errorMessage.includes('not configured')) {
        toast.add({
          title: t('admin.emailPreview.toast.notConfigured'),
          description: t('admin.emailPreview.toast.notConfiguredDescription'),
          color: 'warning',
          icon: 'i-lucide-alert-triangle',
        });
      }
      else {
        toast.add({
          title: t('common.error'),
          description: errorMessage,
          color: 'error',
          icon: 'i-lucide-alert-triangle',
        });
      }
    }
    finally {
      sendingTest.value = false;
    }
  }

  function selectTemplate(id: string) {
    selectedTemplateId.value = id;
  }

  function setViewMode(mode: 'html' | 'text') {
    viewMode.value = mode;
  }

  return {
    // State
    templates,
    loading,
    error,
    selectedTemplateId,
    viewMode,
    sendingTest,
    // Computed
    selectedTemplate,
    // Actions
    fetchTemplates,
    sendTestEmail,
    selectTemplate,
    setViewMode,
  };
}
