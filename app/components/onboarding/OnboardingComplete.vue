<template>
  <div class="py-8 text-center">
    <div class="mb-6">
      <div class="bg-primary/10 mx-auto flex h-20 w-20 items-center justify-center rounded-full">
        <UIcon
          name="i-lucide-check-circle"
          class="text-primary h-12 w-12"
        />
      </div>
    </div>

    <h1 class="mb-4 text-3xl font-bold">
      {{ $t('onboarding.complete.title') }}
    </h1>

    <p class="mx-auto mb-8 max-w-md text-lg text-neutral-600 dark:text-neutral-300">
      {{ $t('onboarding.complete.description') }}
    </p>

    <div class="mx-auto max-w-md rounded-lg bg-neutral-50 p-6 dark:bg-neutral-800">
      <h3 class="mb-3 font-semibold">
        {{ $t('onboarding.complete.whatsNext') }}
      </h3>
      <ul class="space-y-2 text-left text-sm">
        <li class="flex items-start gap-2">
          <UIcon
            name="i-lucide-circle-check"
            class="text-primary mt-0.5 h-4 w-4 flex-shrink-0"
          />
          <span>{{ $t('onboarding.complete.step1') }}</span>
        </li>
        <li class="flex items-start gap-2">
          <UIcon
            name="i-lucide-circle-check"
            class="text-primary mt-0.5 h-4 w-4 flex-shrink-0"
          />
          <span>{{ $t('onboarding.complete.step2') }}</span>
        </li>
        <li class="flex items-start gap-2">
          <UIcon
            name="i-lucide-circle-check"
            class="text-primary mt-0.5 h-4 w-4 flex-shrink-0"
          />
          <span>{{ $t('onboarding.complete.step3') }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
