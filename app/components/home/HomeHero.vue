<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();

const links = computed(() => [
  {
    label: t('home.hero.startForFree'),
    to: localePath('/auth/register'),
    trailingIcon: 'i-lucide-arrow-right',
    size: 'xl' as const,
  },
  {
    label: t('home.hero.viewOnGithub'),
    to: 'https://github.com/AloisH/bistro',
    target: '_blank',
    icon: 'i-simple-icons-github',
    size: 'xl' as const,
    color: 'neutral' as const,
    variant: 'subtle' as const,
  },
]);
</script>

<template>
  <UPageHero
    :headline="t('home.hero.headline')"
    :title="t('home.hero.title')"
    :description="t('home.hero.description')"
    :links="links"
    :ui="{
      title:
        'animate-gradient-text bg-gradient-to-r from-primary-500 via-green-400 to-primary-600 bg-clip-text text-transparent',
    }"
  />
</template>
