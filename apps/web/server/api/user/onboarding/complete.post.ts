import { defineApiHandler } from '../../../utils/api-handler';
import { userService } from '../../../features/user/user-service';

/**
 * POST /api/user/onboarding/complete
 * Mark onboarding as complete
 */
export default defineApiHandler(async (ctx) => {
  await userService.completeOnboarding(ctx.userId);
  return { success: true };
});
