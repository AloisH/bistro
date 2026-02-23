<script setup lang="ts">
const { t } = useI18n();

const features = computed(() => [
  {
    icon: 'i-lucide-list-checks',
    title: t('home.features.simpleTaskManagement'),
    description: t('home.features.simpleTaskManagementDescription'),
  },
  {
    icon: 'i-lucide-filter',
    title: t('home.features.smartFiltering'),
    description: t('home.features.smartFilteringDescription'),
  },
  {
    icon: 'i-lucide-users',
    title: t('home.features.teamCollaboration'),
    description: t('home.features.teamCollaborationDescription'),
  },
  {
    icon: 'i-lucide-moon',
    title: t('home.features.darkMode'),
    description: t('home.features.darkModeDescription'),
  },
  {
    icon: 'i-lucide-smartphone',
    title: t('home.features.worksEverywhere'),
    description: t('home.features.worksEverywhereDescription'),
  },
  {
    icon: 'i-lucide-lock',
    title: t('home.features.secureByDefault'),
    description: t('home.features.secureByDefaultDescription'),
  },
]);
</script>

<template>
  <UPageSection
    id="features"
    :title="t('home.features.title')"
    :description="t('home.features.description')"
    :features="features"
    class="scroll-animate"
  />
</template>
