import type { ImpersonationLog } from '../../../prisma/generated/client';
import type { StartImpersonationInput } from '#shared/schemas/impersonation';
import type { H3Event } from 'h3';
import { auth } from '../auth/auth-config';
import { db } from '../../utils/db';
import { impersonationRepository } from './impersonation-repository';

/**
 * Service for impersonation business logic
 */
export class ImpersonationService {
  /**
   * Start impersonating a user
   *
   * @throws 404 if target user not found
   * @throws 403 if trying to impersonate SUPER_ADMIN
   */
  async startImpersonation(
    adminId: string,
    input: StartImpersonationInput,
    event: H3Event,
  ): Promise<ImpersonationLog> {
    // Validate target user exists
    const targetUser = await db.user.findUnique({
      where: { id: input.userId },
      select: { id: true, role: true },
    });

    if (!targetUser) {
      throw createError({
        statusCode: 404,
        message: 'Target user not found',
      });
    }

    // Prevent impersonating SUPER_ADMIN
    if (targetUser.role === 'SUPER_ADMIN') {
      throw createError({
        statusCode: 403,
        message: 'Cannot impersonate super admin',
      });
    }

    // End any existing active impersonation for this admin
    await impersonationRepository.endLog(adminId);

    // Extract IP and user agent from request
    const ipAddress = getHeader(event, 'x-forwarded-for') || getHeader(event, 'x-real-ip') || undefined;
    const userAgent = getHeader(event, 'user-agent') || undefined;

    // Create audit log
    const log = await impersonationRepository.createLog({
      adminId,
      targetUserId: input.userId,
      reason: input.reason,
      ipAddress,
      userAgent,
    });

    // Call Better Auth impersonation API
    try {
      await auth.api.impersonateUser({
        body: { userId: input.userId },
        headers: event.headers,
      });
    } catch {
      // If Better Auth fails, mark log as ended
      await impersonationRepository.endLog(adminId);
      throw createError({
        statusCode: 500,
        message: 'Failed to start impersonation session',
      });
    }

    return log;
  }

  /**
   * Stop impersonating current user
   *
   * @throws 400 if no active impersonation
   */
  async stopImpersonation(adminId: string, event: H3Event): Promise<void> {
    // Check for active session
    const activeLog = await impersonationRepository.getActiveSession(adminId);
    if (!activeLog) {
      throw createError({
        statusCode: 400,
        message: 'No active impersonation session',
      });
    }

    // Call Better Auth stop impersonation
    try {
      await auth.api.stopImpersonating({
        headers: event.headers,
      });
    } catch {
      throw createError({
        statusCode: 500,
        message: 'Failed to stop impersonation session',
      });
    }

    // End audit log
    await impersonationRepository.endLog(adminId);
  }

  /**
   * Get active impersonation session
   */
  async getActiveImpersonation(adminId: string): Promise<ImpersonationLog | null> {
    return impersonationRepository.getActiveSession(adminId);
  }

  /**
   * Get impersonation audit logs
   */
  async getAuditLogs(filters?: {
    adminId?: string;
    targetUserId?: string;
    limit?: number;
  }): Promise<ImpersonationLog[]> {
    return impersonationRepository.getLogs(filters);
  }
}

export const impersonationService = new ImpersonationService();
