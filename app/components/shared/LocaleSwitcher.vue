<script setup lang="ts">
const { locale, locales } = useI18n();
const switchLocalePath = useSwitchLocalePath();

const availableLocales = computed(() =>
  locales.value.filter(l => typeof l !== 'string'),
);

const currentLocale = computed(() =>
  availableLocales.value.find(l => l.code === locale.value),
);

const items = computed(() => [
  availableLocales.value.map(l => ({
    label: l.name || l.code,
    icon: l.code === locale.value ? 'i-lucide-check' : 'i-lucide-globe',
    onSelect: () => navigateTo(switchLocalePath(l.code)),
  })),
]);
</script>

<template>
  <UDropdownMenu :items="items">
    <UButton
      icon="i-lucide-languages"
      color="neutral"
      variant="ghost"
      :label="currentLocale?.code?.toUpperCase()"
      :aria-label="currentLocale?.name || locale"
    />
  </UDropdownMenu>
</template>
