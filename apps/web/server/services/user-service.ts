import type { UpdateProfileInput, UserProfile } from '#shared/schemas/user';
import { userRepository } from '../repositories/user-repository';
import { scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scrypt);

/**
 * User service
 * Business logic for user operations
 */
export class UserService {
  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<UserProfile> {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found',
      });
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
      hasPassword: !!user.password,
    };
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, input: UpdateProfileInput): Promise<UserProfile> {
    const updated = await userRepository.updateProfile(userId, input);

    return {
      id: updated.id,
      email: updated.email,
      name: updated.name,
      image: updated.image,
      emailVerified: updated.emailVerified,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      hasPassword: !!updated.password,
    };
  }

  /**
   * Verify password against hash
   * Better Auth uses scrypt by default
   */
  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      // Parse Better Auth's scrypt hash format: algorithm:salt:hash
      const parts = hash.split(':');
      if (parts.length !== 3 || parts[0] !== 'scrypt' || !parts[1] || !parts[2]) {
        return false;
      }

      const salt = parts[1];
      const storedHash = parts[2];

      // Hash the input password with the same salt
      const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
      const derivedHash = derivedKey.toString('hex');

      // Timing-safe comparison
      const storedBuffer = Buffer.from(storedHash, 'hex');
      const derivedBuffer = Buffer.from(derivedHash, 'hex');

      return (
        storedBuffer.length === derivedBuffer.length && timingSafeEqual(storedBuffer, derivedBuffer)
      );
    }
    catch {
      return false;
    }
  }

  /**
   * Delete user account with password verification
   * For password-based accounts
   */
  async deleteAccountWithPassword(userId: string, password: string): Promise<void> {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found',
      });
    }

    if (!user.password) {
      throw createError({
        statusCode: 400,
        message: 'Account does not use password authentication',
      });
    }

    // Verify password
    const passwordValid = await this.verifyPassword(password, user.password);

    if (!passwordValid) {
      throw createError({
        statusCode: 401,
        message: 'Invalid password',
      });
    }

    await userRepository.deleteUser(userId);
  }

  /**
   * Delete user account with email verification
   * For OAuth accounts
   */
  async deleteAccountWithEmail(userId: string, email: string): Promise<void> {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found',
      });
    }

    if (user.password) {
      throw createError({
        statusCode: 400,
        message: 'Account uses password authentication',
      });
    }

    // Verify email matches
    if (user.email.toLowerCase() !== email.toLowerCase()) {
      throw createError({
        statusCode: 401,
        message: 'Email does not match',
      });
    }

    await userRepository.deleteUser(userId);
  }
}

// Export singleton instance
export const userService = new UserService();
