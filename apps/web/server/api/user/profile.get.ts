import { defineApiHandler } from '../../utils/api-handler'
import { userService } from '../../services/user-service'

export default defineApiHandler(async (ctx) => {
  const profile = await userService.getProfile(ctx.userId)
  return { profile }
})
