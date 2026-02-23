<script setup lang="ts">
import { z } from 'zod';

const { t } = useI18n();
const toast = useToast();

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  subject: z.enum(['general', 'support', 'feedback', 'other']),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

type ContactForm = z.infer<typeof contactSchema>;

const state = reactive<ContactForm>({
  name: '',
  email: '',
  subject: '' as ContactForm['subject'],
  message: '',
});

const subjectOptions = computed(() => [
  { value: 'general', label: t('contact.subjects.general') },
  { value: 'support', label: t('contact.subjects.support') },
  { value: 'feedback', label: t('contact.subjects.feedback') },
  { value: 'other', label: t('contact.subjects.other') },
]);

const loading = ref(false);

async function onSubmit() {
  loading.value = true;
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: state,
    });

    toast.add({
      title: t('contact.toast.success'),
      description: t('contact.toast.successDescription'),
      color: 'success',
      icon: 'i-lucide-check',
    });

    // Reset form
    state.name = '';
    state.email = '';
    state.subject = '' as ContactForm['subject'];
    state.message = '';
  }
  catch {
    toast.add({
      title: t('common.error'),
      description: t('contact.toast.error'),
      color: 'error',
      icon: 'i-lucide-alert-triangle',
    });
  }
  finally {
    loading.value = false;
  }
}

useSeo({
  title: t('contact.seoTitle'),
  description: t('contact.seoDescription'),
});
</script>

<template>
  <div class="container mx-auto px-4 py-12">
    <div class="mx-auto max-w-2xl">
      <!-- Header -->
      <div class="mb-12 text-center">
        <h1 class="mb-4 text-4xl font-bold text-neutral-900 dark:text-white">
          {{ $t('contact.title') }}
        </h1>
        <p class="text-lg text-neutral-600 dark:text-neutral-400">
          {{ $t('contact.description') }}
        </p>
      </div>

      <!-- Contact Form -->
      <UCard>
        <UForm
          :state="state"
          :schema="contactSchema"
          @submit="onSubmit"
        >
          <div class="space-y-6">
            <UFormField
              name="name"
              :label="t('contact.nameLabel')"
              class="w-full"
            >
              <UInput
                v-model="state.name"
                :placeholder="t('contact.namePlaceholder')"
                icon="i-lucide-user"
                class="w-full"
              />
            </UFormField>

            <UFormField
              name="email"
              :label="t('contact.emailLabel')"
              class="w-full"
            >
              <UInput
                v-model="state.email"
                type="email"
                :placeholder="t('contact.emailPlaceholder')"
                icon="i-lucide-mail"
                class="w-full"
              />
            </UFormField>

            <UFormField
              name="subject"
              :label="t('contact.subjectLabel')"
              class="w-full"
            >
              <USelect
                v-model="state.subject"
                :items="subjectOptions"
                :placeholder="t('contact.subjectPlaceholder')"
                icon="i-lucide-message-square"
                class="w-full"
              />
            </UFormField>

            <UFormField
              name="message"
              :label="t('contact.messageLabel')"
              class="w-full"
            >
              <UTextarea
                v-model="state.message"
                :placeholder="t('contact.messagePlaceholder')"
                :rows="5"
                class="w-full"
              />
            </UFormField>

            <UButton
              type="submit"
              block
              size="lg"
              :loading="loading"
            >
              {{ $t('contact.submitButton') }}
            </UButton>
          </div>
        </UForm>
      </UCard>

      <!-- Alternative contact -->
      <div class="mt-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
        <p>
          {{ $t('contact.preferGithub') }}
          <NuxtLink
            to="https://github.com/AloisH/bistro/issues"
            target="_blank"
            class="text-primary hover:underline"
          >
            {{ $t('contact.openIssue') }}
          </NuxtLink>
          {{ $t('common.or').toLowerCase() }}
          <NuxtLink
            to="https://github.com/AloisH/bistro/discussions"
            target="_blank"
            class="text-primary hover:underline"
          >
            {{ $t('contact.startDiscussion') }}
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
