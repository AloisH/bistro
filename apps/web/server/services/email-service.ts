import { resend } from '../mail/resend';
import { render } from '@vue-email/render';
import type { Component } from 'vue';
import type { SendEmailInput } from '#shared/schemas/email';
import { sendEmailSchema } from '#shared/schemas/email';
import VerifyEmail from '../mail/template/VerifyEmail.vue';

interface SendTemplateEmailOptions<TProps> {
  to: string | string[];
  subject: string;
  template: Component;
  props: TProps;
  from?: string;
  replyTo?: string;
}

/**
 * Email service
 * Handles sending emails via Resend with vue-email templates
 */
export class EmailService {
  /**
   * Get default sender email
   */
  private getDefaultFrom(): string {
    return process.env.RESEND_FROM_EMAIL || 'noreply@resend.dev';
  }

  /**
   * Check if email service is configured
   */
  isConfigured(): boolean {
    return !!resend;
  }

  /**
   * Send email with HTML content
   */
  async sendEmail(options: SendEmailInput): Promise<{ id: string } | null> {
    if (!resend) {
      console.warn('[EmailService] Email not sent - not configured');
      return null;
    }

    const validated = sendEmailSchema.parse(options);

    try {
      const result = await resend.emails.send({
        from: validated.from ?? this.getDefaultFrom(),
        to: validated.to,
        subject: validated.subject,
        html: validated.html,
        text: validated.text,
        replyTo: validated.replyTo,
      });

      if (result.error) {
        console.error('[EmailService] Resend error:', result.error);
        throw createError({
          statusCode: 500,
          message: 'Failed to send email',
          data: result.error,
        });
      }

      return { id: result.data.id };
    } catch (error) {
      console.error('[EmailService] Send failed:', error);
      throw createError({
        statusCode: 500,
        message: 'Failed to send email',
      });
    }
  }

  /**
   * Send email with vue-email template
   */
  async sendTemplateEmail<TProps = Record<string, unknown>>(
    options: SendTemplateEmailOptions<TProps>,
  ): Promise<{ id: string } | null> {
    if (!resend) {
      console.warn('[EmailService] Email not sent - not configured');
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const html = await render(options.template, options.props as any, {
      pretty: process.env.NODE_ENV !== 'production',
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const text = await render(options.template, options.props as any, {
      plainText: true,
    });

    return this.sendEmail({
      to: options.to,
      subject: options.subject,
      html,
      text,
      from: options.from,
      replyTo: options.replyTo,
    });
  }

  /**
   * Send email verification link
   */
  async sendEmailVerification(options: {
    to: string;
    name: string;
    verificationLink: string;
  }): Promise<{ id: string } | null> {
    return this.sendTemplateEmail({
      to: options.to,
      subject: 'Verify your email address',
      template: VerifyEmail,
      props: {
        name: options.name,
        verificationLink: options.verificationLink,
        email: options.to,
      },
    });
  }
}

// Export singleton instance
export const emailService = new EmailService();
