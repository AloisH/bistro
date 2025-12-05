import { defineValidatedApiHandler } from '../../utils/api-handler'
import { updateProfileSchema } from '../../shared/schemas/user'
import { userService } from '../../services/user-service'

export default defineValidatedApiHandler(
  updateProfileSchema,
  async (ctx) => {
    const profile = await userService.updateProfile(ctx.userId, ctx.body!)
    return { profile }
  },
)
