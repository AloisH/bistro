import { defineValidatedApiHandler } from '../../utils/api-handler';
import { updateProfileSchema } from '#shared/user';
import { userService } from '../../features/user/user-service';

export default defineValidatedApiHandler(updateProfileSchema, async (ctx) => {
  const profile = await userService.updateProfile(ctx.userId, ctx.body!);
  return { profile };
});
