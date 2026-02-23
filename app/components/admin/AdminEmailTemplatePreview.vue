<script setup lang="ts">
import type { EmailTemplate } from '~/composables/admin/useEmailTemplates';

interface Props {
  template: EmailTemplate;
  viewMode: 'html' | 'text';
  sendingTest: boolean;
}

defineProps<Props>();

defineEmits<Emits>();

interface Emits {
  (e: 'update:viewMode', mode: 'html' | 'text'): void;
  (e: 'sendTest'): void;
}
</script>

<template>
  <div>
    <div class="mb-4">
      <h3 class="font-semibold">
        {{ template.name }}
      </h3>
      <p class="text-sm text-neutral-600 dark:text-neutral-400">
        {{ template.description }}
      </p>
      <p class="mt-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {{ $t('admin.subject') }} {{ template.subject }}
      </p>
    </div>

    <div class="mb-4 flex items-center gap-2">
      <UButton
        :color="viewMode === 'html' ? 'primary' : 'neutral'"
        :variant="viewMode === 'html' ? 'solid' : 'outline'"
        size="sm"
        @click="$emit('update:viewMode', 'html')"
      >
        {{ $t('admin.htmlPreview') }}
      </UButton>
      <UButton
        :color="viewMode === 'text' ? 'primary' : 'neutral'"
        :variant="viewMode === 'text' ? 'solid' : 'outline'"
        size="sm"
        @click="$emit('update:viewMode', 'text')"
      >
        {{ $t('admin.plainText') }}
      </UButton>
      <div class="ml-auto">
        <UButton
          color="success"
          variant="soft"
          size="sm"
          icon="i-lucide-send"
          :loading="sendingTest"
          @click="$emit('sendTest')"
        >
          {{ $t('admin.sendTestEmail') }}
        </UButton>
      </div>
    </div>

    <div
      v-if="viewMode === 'html'"
      class="border-default rounded-lg border"
    >
      <iframe
        :srcdoc="template.html"
        class="h-[600px] w-full rounded-lg"
        :title="$t('admin.emailPreviewIframe')"
        sandbox="allow-same-origin"
      />
    </div>

    <div
      v-else
      class="border-default bg-muted rounded-lg border p-4"
    >
      <pre class="text-sm whitespace-pre-wrap">{{ template.text }}</pre>
    </div>

    <div class="mt-4 rounded-lg bg-neutral-50 p-4 dark:bg-neutral-800">
      <h4 class="mb-2 text-sm font-semibold">
        {{ $t('admin.sampleData') }}
      </h4>
      <pre class="text-xs text-neutral-600 dark:text-neutral-400">{{
        JSON.stringify(template.props, null, 2)
      }}</pre>
    </div>
  </div>
</template>
