import { updateOnboardingSchema } from '#shared/schemas/user';
import { userService } from '../../features/user/user-service';
import { defineValidatedApiHandler } from '../../utils/api-handler';

/**
 * PUT /api/user/onboarding
 * Update onboarding step data
 */
export default defineValidatedApiHandler(updateOnboardingSchema, async (ctx) => {
  const state = await userService.updateOnboarding(ctx.userId, ctx.body!);
  return state;
});
