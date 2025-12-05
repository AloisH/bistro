import { defineApiHandler } from '../../../utils/api-handler'
import { projectService } from '../../../services/project-service'

export default defineApiHandler(async (ctx) => {
  const id = getRouterParam(ctx.event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Project ID is required' })
  }

  await projectService.deleteProject(id, ctx.userId)
  return { success: true }
})
