<script setup lang="ts">
definePageMeta({
  layout: false,
});

const STORAGE_KEY = 'bistro:onboarding';
const TOTAL_STEPS = 5;

const { fetchSession } = useAuth();
const toast = useToast();

// State
const state = reactive({
  currentStep: 1,
  profile: {
    bio: '',
    company: '',
  },
  preferences: {
    emailNotifications: true,
  },
  useCase: '',
});

const isLoading = ref(false);

// Computed
const isFirstStep = computed(() => state.currentStep === 1);
const isLastStep = computed(() => state.currentStep === TOTAL_STEPS);

// Load from localStorage on mount
onMounted(() => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      Object.assign(state, parsed);
    } catch {
      console.warn('Failed to load onboarding state');
    }
  }
});

// Save to localStorage on state change
watch(
  state,
  (newState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  },
  { deep: true },
);

// Step navigation
async function nextStep() {
  if (isLoading.value) return;

  if (state.currentStep < TOTAL_STEPS) {
    // Auto-save current step data to backend
    await saveCurrentStep();
    state.currentStep++;
  } else {
    // Complete onboarding
    await complete();
  }
}

function previousStep() {
  if (state.currentStep > 1) {
    state.currentStep--;
  }
}

async function skipStep() {
  if (isLoading.value) return;

  // Skip current step only (move to next)
  if (state.currentStep < TOTAL_STEPS) {
    state.currentStep++;
  } else {
    // If on last step, complete
    await complete();
  }
}

async function saveCurrentStep() {
  // Steps 1 and 5 don't save data
  if (state.currentStep === 1 || state.currentStep === 5) return;

  try {
    isLoading.value = true;

    const stepMap: Record<number, { step: 'profile' | 'preferences' | 'useCase'; data: Record<string, unknown> }> = {
      2: { step: 'profile', data: state.profile },
      3: { step: 'preferences', data: state.preferences },
      4: { step: 'useCase', data: { useCase: state.useCase } },
    };

    const payload = stepMap[state.currentStep];
    if (payload) {
      await $fetch('/api/user/onboarding', {
        method: 'PUT',
        body: payload,
      });
    }
  } catch (error) {
    console.error('Failed to save step:', error);
    toast.add({
      title: 'Error',
      description: (error as { data?: { message?: string } })?.data?.message || 'Failed to save progress',
      color: 'error',
    });
    throw error;
  } finally {
    isLoading.value = false;
  }
}

async function complete() {
  try {
    isLoading.value = true;

    await $fetch('/api/user/onboarding/complete', {
      method: 'POST',
    });

    // Clear localStorage
    localStorage.removeItem(STORAGE_KEY);

    // Fetch updated session
    await fetchSession();

    toast.add({
      title: 'Welcome!',
      description: 'Your account is all set up',
      color: 'success',
    });

    // Force full page reload to refresh session cache
    window.location.href = '/dashboard';
  } catch (error) {
    console.error('Failed to complete onboarding:', error);
    toast.add({
      title: 'Error',
      description: (error as { data?: { message?: string } })?.data?.message || 'Failed to complete onboarding',
      color: 'error',
    });
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
    <UCard class="w-full max-w-2xl">
      <template #header>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold">Welcome to Bistro</h2>
            <UButton
              variant="ghost"
              color="neutral"
              size="sm"
              :disabled="isLoading"
              @click="skipStep"
            >
              Skip
            </UButton>
          </div>
          <OnboardingProgress
            :current-step="state.currentStep"
            :total-steps="TOTAL_STEPS"
          />
        </div>
      </template>

      <!-- Step content -->
      <div class="min-h-[400px]">
        <Transition
          name="slide-fade"
          mode="out-in"
        >
          <OnboardingWelcome
            v-if="state.currentStep === 1"
            :key="1"
          />
          <OnboardingProfile
            v-else-if="state.currentStep === 2"
            :key="2"
            v-model="state.profile"
          />
          <OnboardingPreferences
            v-else-if="state.currentStep === 3"
            :key="3"
            v-model="state.preferences"
          />
          <OnboardingUseCase
            v-else-if="state.currentStep === 4"
            :key="4"
            v-model="state.useCase"
          />
          <OnboardingComplete
            v-else-if="state.currentStep === 5"
            :key="5"
          />
        </Transition>
      </div>

      <template #footer>
        <div class="flex justify-between gap-3">
          <UButton
            v-if="!isFirstStep"
            variant="outline"
            color="neutral"
            size="lg"
            :disabled="isLoading"
            @click="previousStep"
          >
            <template #leading>
              <UIcon name="i-lucide-chevron-left" />
            </template>
            Back
          </UButton>
          <div v-else />

          <UButton
            color="primary"
            size="lg"
            :loading="isLoading"
            @click="nextStep"
          >
            {{ isLastStep ? 'Go to Dashboard' : 'Next' }}
            <template
              v-if="!isLastStep"
              #trailing
            >
              <UIcon name="i-lucide-chevron-right" />
            </template>
          </UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>
