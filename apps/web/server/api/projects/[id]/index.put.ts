import { defineValidatedApiHandler } from '../../../utils/api-handler'
import { updateProjectSchema } from '../../../shared/schemas/project'
import { projectService } from '../../../services/project-service'

export default defineValidatedApiHandler(
  updateProjectSchema,
  async (ctx) => {
    const id = getRouterParam(ctx.event, 'id')
    if (!id) {
      throw createError({ statusCode: 400, message: 'Project ID is required' })
    }

    const project = await projectService.updateProject(id, ctx.userId, ctx.body!)
    return { project }
  },
)
