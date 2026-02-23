<script setup lang="ts">
const { t } = useI18n();

const model = defineModel<{ emailNotifications: boolean }>({ required: true });

const colorMode = useColorMode();

const colorModeOptions = computed(() => [
  { value: 'light', label: t('onboarding.preferences.light'), icon: 'i-lucide-sun' },
  { value: 'dark', label: t('onboarding.preferences.dark'), icon: 'i-lucide-moon' },
  { value: 'system', label: t('onboarding.preferences.system'), icon: 'i-lucide-laptop' },
]);
</script>

<template>
  <div class="py-4">
    <div class="mb-6">
      <h2 class="mb-2 text-2xl font-bold">
        {{ $t('onboarding.preferences.title') }}
      </h2>
      <p class="text-neutral-600 dark:text-neutral-300">
        {{ $t('onboarding.preferences.description') }}
      </p>
    </div>

    <div class="space-y-6">
      <!-- Dark mode -->
      <fieldset>
        <legend class="mb-3 block text-sm font-medium">
          {{ $t('onboarding.preferences.themeLabel') }}
        </legend>
        <div class="grid grid-cols-3 gap-3">
          <button
            v-for="option in colorModeOptions"
            :key="option.value"
            type="button"
            class="flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all" :class="[
              colorMode.preference === option.value
                ? 'border-primary bg-primary/5'
                : 'border-default hover:border-neutral-400 dark:hover:border-neutral-500',
            ]"
            @click="colorMode.preference = option.value as 'light' | 'dark' | 'system'"
          >
            <UIcon
              :name="option.icon"
              class="h-6 w-6"
            />
            <span class="text-sm font-medium">{{ option.label }}</span>
          </button>
        </div>
      </fieldset>

      <!-- Email notifications -->
      <div class="flex items-start gap-3">
        <UCheckbox
          id="email-notifications"
          v-model="model.emailNotifications"
        />
        <div class="flex-1">
          <label
            for="email-notifications"
            class="block cursor-pointer text-sm font-medium"
          >
            {{ $t('onboarding.preferences.emailNotificationsLabel') }}
          </label>
          <p class="text-sm text-neutral-500 dark:text-neutral-400">
            {{ $t('onboarding.preferences.emailNotificationsDescription') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
