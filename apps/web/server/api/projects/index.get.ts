import { defineApiHandler } from '../../utils/api-handler'
import { projectService } from '../../services/project-service'

export default defineApiHandler(async (ctx) => {
  const projects = await projectService.listProjects(ctx.userId)
  return { projects }
})
