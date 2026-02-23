<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();

const billingPeriod = ref('monthly');
const billingOptions = computed(() => [
  { label: t('home.pricing.monthly'), value: 'monthly' },
  { label: t('home.pricing.yearly'), value: 'yearly', badge: t('home.pricing.yearlySave') },
]);

const plans = computed(() => ({
  free: {
    title: t('home.pricing.free.title'),
    description: t('home.pricing.free.description'),
    tagline: t('home.pricing.free.tagline'),
    features: [
      t('home.pricing.free.features.unlimitedTasks'),
      t('home.pricing.free.features.unlimitedOrganizations'),
      t('home.pricing.free.features.teamCollaboration'),
      t('home.pricing.free.features.darkMode'),
      t('home.pricing.free.features.mobileResponsive'),
      t('home.pricing.free.features.openSource'),
    ],
    button: {
      label: t('home.pricing.free.getStarted'),
      to: localePath('/auth/register'),
    },
    highlight: true,
    monthly: { price: '$0', discount: '' },
    yearly: { price: '$0', discount: '' },
  },
}));

const currentPlans = computed(() => {
  const period = billingPeriod.value as 'monthly' | 'yearly';
  return Object.values(plans.value).map(plan => ({
    title: plan.title,
    description: plan.description,
    tagline: plan.tagline,
    price: plan[period].price,
    discount: plan[period].discount,
    features: plan.features,
    button: plan.button,
    highlight: plan.highlight,
  }));
});
</script>

<template>
  <UPageSection
    id="pricing"
    :title="t('home.pricing.title')"
    :description="t('home.pricing.description')"
    class="scroll-animate"
  >
    <div class="mb-8 flex justify-center">
      <UTabs
        v-model="billingPeriod"
        :items="billingOptions"
        size="lg"
      />
    </div>

    <div class="flex justify-center">
      <UPricingPlans
        :plans="currentPlans"
        compact
        class="max-w-sm"
      />
    </div>
  </UPageSection>
</template>
