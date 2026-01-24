import { defineApiHandler } from '../../utils/api-handler';
import { userService } from '../../features/user/user-service';

defineRouteMeta({
  openAPI: {
    tags: ['User'],
    description: 'Get current user profile',
  },
});

export default defineApiHandler(async (ctx) => {
  const profile = await userService.getProfile(ctx.userId);
  return { profile };
});
