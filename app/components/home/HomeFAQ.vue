<script setup lang="ts">
const { t } = useI18n();

const faqItems = computed(() => [
  {
    label: t('home.faq.q1'),
    content: t('home.faq.a1'),
  },
  {
    label: t('home.faq.q2'),
    content: t('home.faq.a2'),
  },
  {
    label: t('home.faq.q3'),
    content: t('home.faq.a3'),
  },
  {
    label: t('home.faq.q4'),
    content: t('home.faq.a4'),
  },
  {
    label: t('home.faq.q5'),
    content: t('home.faq.a5'),
  },
]);
</script>

<template>
  <UPageSection
    id="faq"
    :title="t('home.faq.title')"
    :description="t('home.faq.description')"
    class="scroll-animate"
  >
    <UAccordion
      :items="faqItems"
      class="mx-auto max-w-2xl"
    />
  </UPageSection>
</template>
