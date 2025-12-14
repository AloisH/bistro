import { defineApiHandler } from '../../../utils/api-handler';
import { userRepository } from '../../../features/user/user-repository';

/**
 * POST /api/user/onboarding/restart
 * Reset onboarding (sets onboardingCompleted to false)
 */
export default defineApiHandler(async (ctx) => {
  await userRepository.updateOnboarding(ctx.userId, {
    onboardingCompleted: false,
    onboardingSteps: {},
  });
  return { success: true };
});
