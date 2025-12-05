import type { Project, Prisma } from '../../prisma/generated/client'
import { BaseRepository } from './base-repository'

/**
 * Project repository
 * Handles project-related database queries
 * ALL methods are user-scoped
 */
export class ProjectRepository extends BaseRepository {
  /**
   * Find all projects for a user
   */
  async findByUserId(userId: string): Promise<Project[]> {
    return this.db.project.findMany({
      where: { userId },
      include: { aiJobs: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  /**
   * Find project by ID (with ownership check)
   * Returns null if not found or user doesn't own it
   */
  async findById(id: string, userId: string): Promise<Project | null> {
    return this.db.project.findFirst({
      where: { id, userId },
      include: { aiJobs: true },
    })
  }

  /**
   * Find project by slug (with ownership check)
   * Used for duplicate checking
   */
  async findBySlug(slug: string, userId: string): Promise<Project | null> {
    return this.db.project.findFirst({
      where: { slug, userId },
    })
  }

  /**
   * Create new project
   */
  async create(userId: string, data: Prisma.ProjectCreateInput): Promise<Project> {
    return this.db.project.create({
      data,
    })
  }

  /**
   * Update project (with ownership check)
   * Returns null if not found or user doesn't own it
   */
  async update(
    id: string,
    userId: string,
    data: Prisma.ProjectUpdateInput
  ): Promise<Project | null> {
    // Check ownership first
    const existing = await this.findById(id, userId)
    if (!existing) {
      return null
    }

    return this.db.project.update({
      where: { id },
      data,
    })
  }

  /**
   * Delete project (with ownership check)
   * Returns null if not found or user doesn't own it
   */
  async delete(id: string, userId: string): Promise<Project | null> {
    // Check ownership first
    const existing = await this.findById(id, userId)
    if (!existing) {
      return null
    }

    return this.db.project.delete({
      where: { id },
    })
  }
}

// Export singleton instance
export const projectRepository = new ProjectRepository()
