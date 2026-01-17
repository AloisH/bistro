<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar title="Email Preview">
        <template #right>
          <UColorModeButton />
        </template>
      </UDashboardNavbar>
    </template>

    <div class="mb-6">
      <h1 class="text-2xl font-bold">Email Template Previews</h1>
      <p class="text-sm text-neutral-600 dark:text-neutral-400">
        Preview how email templates appear to recipients
      </p>
    </div>

    <UCard v-if="!loading && templates.length > 0">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">Templates</h2>
          <UBadge color="neutral">{{ templates.length }} templates</UBadge>
        </div>
      </template>

      <div class="space-y-4">
        <div class="border-b border-neutral-200 dark:border-neutral-700">
          <nav class="-mb-px flex gap-4">
            <button
              v-for="template in templates"
              :key="template.id"
              :class="[
                'border-b-2 px-1 py-3 text-sm font-medium transition-colors',
                selectedTemplateId === template.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-neutral-600 hover:border-neutral-300 hover:text-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-600 dark:hover:text-neutral-200',
              ]"
              @click="selectedTemplateId = template.id"
            >
              {{ template.name }}
            </button>
          </nav>
        </div>

        <div v-if="selectedTemplate">
          <div class="mb-4">
            <h3 class="font-semibold">{{ selectedTemplate.name }}</h3>
            <p class="text-sm text-neutral-600 dark:text-neutral-400">
              {{ selectedTemplate.description }}
            </p>
            <p class="mt-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Subject: {{ selectedTemplate.subject }}
            </p>
          </div>

          <div class="mb-4 flex items-center gap-2">
            <UButton
              :color="viewMode === 'html' ? 'primary' : 'neutral'"
              :variant="viewMode === 'html' ? 'solid' : 'outline'"
              size="sm"
              @click="viewMode = 'html'"
            >
              HTML Preview
            </UButton>
            <UButton
              :color="viewMode === 'text' ? 'primary' : 'neutral'"
              :variant="viewMode === 'text' ? 'solid' : 'outline'"
              size="sm"
              @click="viewMode = 'text'"
            >
              Plain Text
            </UButton>
            <div class="ml-auto">
              <UButton
                color="success"
                variant="soft"
                size="sm"
                icon="i-lucide-send"
                :loading="sendingTest"
                @click="sendTestEmail"
              >
                Send Test Email
              </UButton>
            </div>
          </div>

          <div
            v-if="viewMode === 'html'"
            class="rounded-lg border border-neutral-200 dark:border-neutral-700"
          >
            <iframe
              :srcdoc="selectedTemplate.html"
              class="h-[600px] w-full rounded-lg"
              title="Email preview"
              sandbox="allow-same-origin"
            />
          </div>

          <div
            v-else
            class="rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800"
          >
            <pre class="text-sm whitespace-pre-wrap">{{ selectedTemplate.text }}</pre>
          </div>

          <div class="mt-4 rounded-lg bg-neutral-50 p-4 dark:bg-neutral-800">
            <h4 class="mb-2 text-sm font-semibold">Sample Data</h4>
            <pre class="text-xs text-neutral-600 dark:text-neutral-400">{{
              JSON.stringify(selectedTemplate.props, null, 2)
            }}</pre>
          </div>
        </div>
      </div>
    </UCard>

    <UCard v-else-if="loading">
      <div class="flex items-center justify-center py-12">
        <div class="text-neutral-600 dark:text-neutral-400">Loading templates...</div>
      </div>
    </UCard>

    <UCard v-else-if="error">
      <UAlert
        color="error"
        icon="i-lucide-alert-triangle"
        :title="error"
        description="Failed to load email templates"
      />
    </UCard>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
});

interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  html: string;
  text: string;
  props: Record<string, unknown>;
}

const { isAdmin } = useRole();
const { user } = useAuth();
const toast = useToast();

onMounted(() => {
  if (!isAdmin.value) {
    toast.add({
      title: 'Access denied',
      description: 'You do not have permission to access this page',
      color: 'error',
      icon: 'i-lucide-alert-triangle',
    });
    navigateTo({ name: 'index' });
  }
});

const loading = ref(true);
const error = ref('');
const templates = ref<EmailTemplate[]>([]);
const selectedTemplateId = ref('verify-email');
const viewMode = ref<'html' | 'text'>('html');
const sendingTest = ref(false);

const selectedTemplate = computed(() =>
  templates.value.find(t => t.id === selectedTemplateId.value),
);

onMounted(async () => {
  await fetchTemplates();
});

async function fetchTemplates() {
  loading.value = true;
  error.value = '';
  try {
    const response = await $fetch('/api/admin/email-preview');
    templates.value = response.templates;
  } catch (err) {
    const apiError = err as { data?: { message?: string } };
    error.value = apiError.data?.message || 'Failed to load templates';
    toast.add({
      title: 'Error',
      description: error.value,
      color: 'error',
      icon: 'i-lucide-alert-triangle',
    });
  } finally {
    loading.value = false;
  }
}

async function sendTestEmail() {
  if (!selectedTemplate.value) return;

  sendingTest.value = true;
  try {
    await $fetch('/api/admin/email-preview/send-test', {
      method: 'POST',
      body: {
        templateId: selectedTemplate.value.id,
      },
    });

    toast.add({
      title: 'Test email sent',
      description: `Check your inbox at ${user.value?.email}`,
      color: 'success',
      icon: 'i-lucide-check',
    });
  } catch (err) {
    const apiError = err as { data?: { message?: string } };
    const errorMessage = apiError.data?.message || 'Failed to send test email';

    if (errorMessage.includes('not configured')) {
      toast.add({
        title: 'Email not configured',
        description: 'RESEND_API_KEY missing - emails disabled',
        color: 'warning',
        icon: 'i-lucide-alert-triangle',
      });
    } else {
      toast.add({
        title: 'Error',
        description: errorMessage,
        color: 'error',
        icon: 'i-lucide-alert-triangle',
      });
    }
  } finally {
    sendingTest.value = false;
  }
}
</script>
