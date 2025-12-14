import { requireRole } from '../../../utils/require-role';
import { emailService } from '../../../features/email/email-service';
import { z } from 'zod';
import VerifyEmail from '../../../features/email/templates/VerifyEmail.vue';
import ResetPasswordEmail from '../../../features/email/templates/ResetPasswordEmail.vue';
import MagicLinkEmail from '../../../features/email/templates/MagicLinkEmail.vue';
import AccountDeletion from '../../../features/email/templates/AccountDeletion.vue';
import type { Component } from 'vue';

const sendTestEmailSchema = z.object({
  templateId: z.enum(['verify-email', 'reset-password', 'magic-link', 'account-deletion']),
});

export default defineEventHandler(async (event) => {
  const ctx = await requireRole(event, ['ADMIN', 'SUPER_ADMIN']);

  if (!emailService.isConfigured()) {
    throw createError({
      statusCode: 503,
      message: 'Email service not configured - RESEND_API_KEY missing',
    });
  }

  const body = await readBody(event);
  const { templateId } = sendTestEmailSchema.parse(body);

  const sampleData = {
    'verify-email': {
      name: 'John Doe',
      verificationLink: 'https://bistro.dev/auth/verify-email?token=abc123def456',
      email: 'john.doe@example.com',
    },
    'reset-password': {
      name: 'Jane Smith',
      resetLink: 'https://bistro.dev/auth/reset-password?token=xyz789uvw012',
      email: 'jane.smith@example.com',
    },
    'magic-link': {
      magicLink: 'https://bistro.dev/auth/magic-link?token=magic123link456',
      email: 'user@example.com',
    },
    'account-deletion': {
      name: 'Bob Johnson',
    },
  };

  const templateMap: Record<string, { template: Component; subject: string }> = {
    'verify-email': {
      template: VerifyEmail,
      subject: 'Verify your email address',
    },
    'reset-password': {
      template: ResetPasswordEmail,
      subject: 'Reset your Bistro password',
    },
    'magic-link': {
      template: MagicLinkEmail,
      subject: 'Your login link for Bistro',
    },
    'account-deletion': {
      template: AccountDeletion,
      subject: 'Your Bistro account has been deleted',
    },
  };

  const user = await db.user.findUnique({
    where: { id: ctx.userId },
    select: { email: true },
  });

  if (!user?.email) {
    throw createError({
      statusCode: 404,
      message: 'User not found',
    });
  }

  const { template, subject } = templateMap[templateId];
  const props = sampleData[templateId];

  await emailService.sendTemplateEmail({
    to: user.email,
    subject: `[TEST] ${subject}`,
    template,
    props,
  });

  return {
    success: true,
    message: `Test email sent to ${user.email}`,
  };
});
