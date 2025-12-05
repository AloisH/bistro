import { defineValidatedApiHandler } from '../../utils/api-handler'
import { createProjectSchema } from '../../shared/schemas/project'
import { projectService } from '../../services/project-service'

export default defineValidatedApiHandler(
  createProjectSchema,
  async (ctx) => {
    const project = await projectService.createProject(ctx.userId, ctx.body!)
    return { project }
  }
)
