import type { User } from '../../prisma/generated/client'
import { BaseRepository } from './base-repository'

/**
 * User repository
 * Handles user-related database queries
 */
export class UserRepository extends BaseRepository {
  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    return this.db.user.findUnique({
      where: { id },
    })
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.db.user.findUnique({
      where: { email },
    })
  }

  /**
   * Update user profile
   * Only allows updating name and image
   */
  async updateProfile(
    id: string,
    data: { name?: string, image?: string },
  ): Promise<User> {
    return this.db.user.update({
      where: { id },
      data,
    })
  }
}

// Export singleton instance
export const userRepository = new UserRepository()
