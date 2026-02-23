<script setup lang="ts">
const { t } = useI18n();

const testimonials = computed(() => [
  {
    name: t('home.testimonials.sarah.name'),
    role: t('home.testimonials.sarah.role'),
    quote: t('home.testimonials.sarah.quote'),
  },
  {
    name: t('home.testimonials.marcus.name'),
    role: t('home.testimonials.marcus.role'),
    quote: t('home.testimonials.marcus.quote'),
  },
  {
    name: t('home.testimonials.emily.name'),
    role: t('home.testimonials.emily.role'),
    quote: t('home.testimonials.emily.quote'),
  },
]);
</script>

<template>
  <UPageSection
    :title="t('home.testimonials.title')"
    :description="t('home.testimonials.description')"
    class="scroll-animate"
  >
    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
      <UCard
        v-for="(testimonial, index) in testimonials"
        :key="testimonial.name"
        class="card-hover flex flex-col"
        :style="{ animationDelay: `${index * 100}ms` }"
      >
        <div class="flex-1">
          <UIcon
            name="i-lucide-quote"
            class="text-primary mb-3 size-6"
          />
          <p class="text-muted">
            {{ testimonial.quote }}
          </p>
        </div>
        <div class="border-default mt-4 flex items-center gap-3 border-t pt-4">
          <UAvatar
            :text="
              testimonial.name
                .split(' ')
                .map((n) => n[0])
                .join('')
            "
            size="md"
          />
          <div>
            <p class="text-sm font-medium">
              {{ testimonial.name }}
            </p>
            <p class="text-muted text-xs">
              {{ testimonial.role }}
            </p>
          </div>
        </div>
      </UCard>
    </div>
  </UPageSection>
</template>
