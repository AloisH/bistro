import type { UpdateProfileInput, UserProfile } from '../shared/schemas/user'
import { userRepository } from '../repositories/user-repository'

/**
 * User service
 * Business logic for user operations
 */
export class UserService {
  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<UserProfile> {
    const user = await userRepository.findById(userId)

    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found',
      })
    }

    // Return only public profile fields
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      image: user.image,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, input: UpdateProfileInput): Promise<UserProfile> {
    const updated = await userRepository.updateProfile(userId, input)

    return {
      id: updated.id,
      email: updated.email,
      name: updated.name,
      image: updated.image,
      emailVerified: updated.emailVerified,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    }
  }
}

// Export singleton instance
export const userService = new UserService()
