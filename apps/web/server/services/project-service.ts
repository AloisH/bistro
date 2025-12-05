import type { Project } from '../../prisma/generated/client'
import type { CreateProjectInput, UpdateProjectInput } from '#shared/schemas/project'
import { projectRepository } from '../repositories/project-repository'

/**
 * Project service
 * Business logic for project operations
 */
export class ProjectService {
  /**
   * List all projects for a user
   */
  async listProjects(userId: string): Promise<Project[]> {
    return projectRepository.findByUserId(userId)
  }

  /**
   * Get single project
   */
  async getProject(id: string, userId: string): Promise<Project> {
    const project = await projectRepository.findById(id, userId)

    if (!project) {
      throw createError({
        statusCode: 404,
        message: 'Project not found',
      })
    }

    return project
  }

  /**
   * Create new project
   * Checks for duplicate slug
   */
  async createProject(userId: string, input: CreateProjectInput): Promise<Project> {
    // Check for duplicate slug
    const existing = await projectRepository.findBySlug(input.slug, userId)
    if (existing) {
      throw createError({
        statusCode: 409,
        message: 'Project with this slug already exists',
      })
    }

    return projectRepository.create(userId, {
      ...input,
      status: 'draft',
      user: {
        connect: { id: userId },
      },
    })
  }

  /**
   * Update project
   * Checks ownership and slug uniqueness if slug is being changed
   */
  async updateProject(
    id: string,
    userId: string,
    input: UpdateProjectInput,
  ): Promise<Project> {
    // Check if slug is being changed and if it's unique
    if (input.slug) {
      const existing = await projectRepository.findBySlug(input.slug, userId)
      if (existing && existing.id !== id) {
        throw createError({
          statusCode: 409,
          message: 'Project with this slug already exists',
        })
      }
    }

    const updated = await projectRepository.update(id, userId, input)

    if (!updated) {
      throw createError({
        statusCode: 404,
        message: 'Project not found',
      })
    }

    return updated
  }

  /**
   * Delete project
   */
  async deleteProject(id: string, userId: string): Promise<void> {
    const deleted = await projectRepository.delete(id, userId)

    if (!deleted) {
      throw createError({
        statusCode: 404,
        message: 'Project not found',
      })
    }
  }
}

// Export singleton instance
export const projectService = new ProjectService()
