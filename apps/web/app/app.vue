<script setup>
// Auto-refresh session before expiry
useSessionRefresh();

const config = useRuntimeConfig();
const siteUrl = config.public.appUrl || 'http://localhost:3000';

const title = 'Bistro';
const description = 'Production-ready Nuxt 4 SaaS boilerplate with auth, multi-tenancy, and RBAC.';

// WebSite JSON-LD schema
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  'name': title,
  description,
  'url': siteUrl,
};

useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'en',
  },
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(websiteSchema),
    },
  ],
});

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: '/og-image.png',
  twitterImage: '/og-image.png',
  twitterCard: 'summary_large_image',
});
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
