<script setup lang="ts">
const { t } = useI18n();
const { email, subscribing, subscribe } = useNewsletter();
</script>

<template>
  <UPageSection
    id="early-access"
    class="scroll-animate"
  >
    <UPageCTA
      :title="t('home.cta.title')"
      :description="t('home.cta.description')"
      variant="subtle"
    >
      <template #links>
        <form
          class="flex w-full max-w-md flex-col gap-3 sm:flex-row"
          @submit.prevent="subscribe"
        >
          <UInput
            v-model="email"
            type="email"
            :placeholder="t('home.cta.emailPlaceholder')"
            size="lg"
            class="flex-1"
            required
          />
          <UButton
            type="submit"
            size="lg"
            :loading="subscribing"
          >
            {{ t('home.cta.subscribe') }}
          </UButton>
        </form>
      </template>
    </UPageCTA>
  </UPageSection>
</template>
