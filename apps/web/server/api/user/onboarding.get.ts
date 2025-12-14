import { defineApiHandler } from '../../utils/api-handler';
import { userService } from '../../features/user/user-service';

/**
 * GET /api/user/onboarding
 * Get current onboarding state
 */
export default defineApiHandler(async (ctx) => {
  const state = await userService.getOnboardingState(ctx.userId);
  return state;
});
