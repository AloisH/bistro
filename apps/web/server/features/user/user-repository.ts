import type { Role, User } from '../../../prisma/generated/client';
import { db } from '../../utils/db';

/**
 * User repository
 * Handles user-related database queries
 */
export class UserRepository {
  protected readonly db = db;
  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    return this.db.user.findUnique({
      where: { id },
    });
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.db.user.findUnique({
      where: { email },
    });
  }

  /**
   * Update user profile
   * Only allows updating name and image
   */
  async updateProfile(id: string, data: { name?: string; image?: string }): Promise<User> {
    return this.db.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete user
   * Cascade deletes all related data (sessions, accounts, projects, AI jobs)
   */
  async deleteUser(id: string): Promise<boolean> {
    const result = await this.db.user.delete({
      where: { id },
    });
    return !!result;
  }

  /**
   * Update user role
   * Only SUPER_ADMIN can change roles
   */
  async updateRole(id: string, role: Role): Promise<User> {
    return this.db.user.update({
      where: { id },
      data: { role },
    });
  }

  /**
   * List all users with their roles
   * Only for admin endpoints
   */
  async listAllUsers(): Promise<User[]> {
    return this.db.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}

// Export singleton instance
export const userRepository = new UserRepository();
