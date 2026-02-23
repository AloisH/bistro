<script setup>
import { en, fr } from '@nuxt/ui/locale';

// Auto-refresh session before expiry
useSessionRefresh();

const { locale, t } = useI18n();
const head = useLocaleHead({ addSeoAttributes: true });

const config = useRuntimeConfig();
const siteUrl = config.public.appUrl || 'http://localhost:3000';

const uiLocale = computed(() => (locale.value === 'fr' ? fr : en));

const title = computed(() => t('seo.title'));
const description = computed(() => t('seo.description'));

// WebSite JSON-LD schema
const websiteSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  'name': title.value,
  'description': description.value,
  'url': siteUrl,
}));

useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
    ...(head.value.link || []),
  ],
  htmlAttrs: {
    lang: locale,
  },
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify(websiteSchema.value)),
    },
  ],
});

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary_large_image',
});

// Dynamic OG image generation
defineOgImageComponent('NuxtSeo', {
  title: 'Bistro',
  description: 'Production-ready Nuxt 4 SaaS boilerplate with auth, multi-tenancy, and RBAC.',
});
</script>

<template>
  <UApp :locale="uiLocale">
    <!-- Skip to content link for keyboard/screen reader users -->
    <a
      href="#main-content"
      class="focus:bg-primary sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:text-white focus:outline-none"
    >
      {{ $t('common.skipToContent') }}
    </a>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
