import { defineApiHandler } from '../../../utils/api-handler';
import { userRepository } from '../../../features/user/user-repository';

defineRouteMeta({
  openAPI: {
    tags: ['User'],
    description: 'Reset onboarding to initial state',
  },
});

export default defineApiHandler(async (ctx) => {
  await userRepository.updateOnboarding(ctx.userId, {
    onboardingCompleted: false,
    onboardingSteps: {},
  });
  return { success: true };
});
