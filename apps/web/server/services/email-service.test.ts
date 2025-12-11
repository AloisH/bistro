import { describe, it, expect, vi, beforeEach } from 'vitest';

import { EmailService } from './email-service';
import { resend } from '../mail/resend';
import { render } from '@vue-email/render';

// Mock resend
vi.mock('../mail/resend', () => ({
  resend: {
    emails: {
      send: vi.fn(),
    },
  },
}));

// Mock vue-email render
vi.mock('@vue-email/render', () => ({
  render: vi.fn(),
}));

// Mock createError
vi.mock('h3', () => ({
  createError: vi.fn(error => error),
}));

const mockSend = resend!.emails.send as ReturnType<typeof vi.fn>;
const mockRender = render as ReturnType<typeof vi.fn>;

describe('EmailService', () => {
  let emailService: EmailService;

  beforeEach(() => {
    vi.clearAllMocks();
    emailService = new EmailService();
    mockSend.mockResolvedValue({
      data: { id: 'test-email-id' },
      error: null,
    });
    mockRender.mockResolvedValue('<html>rendered</html>');
  });

  describe('isConfigured', () => {
    it('returns true when resend is configured', () => {
      expect(emailService.isConfigured()).toBe(true);
    });
  });

  describe('sendEmail', () => {
    it('sends email successfully with valid input', async () => {
      const result = await emailService.sendEmail({
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<p>Test</p>',
      });

      expect(result).toEqual({ id: 'test-email-id' });
      expect(mockSend).toHaveBeenCalledWith({
        from: 'noreply@resend.dev',
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<p>Test</p>',
        text: undefined,
        replyTo: undefined,
      });
    });

    it('sends email to multiple recipients', async () => {
      await emailService.sendEmail({
        to: ['test1@example.com', 'test2@example.com'],
        subject: 'Test',
        html: '<p>Test</p>',
      });

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          to: ['test1@example.com', 'test2@example.com'],
        }),
      );
    });

    it('uses custom sender when provided', async () => {
      await emailService.sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
        from: 'custom@example.com',
      });

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'custom@example.com',
        }),
      );
    });

    it('includes replyTo when provided', async () => {
      await emailService.sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>',
        replyTo: 'reply@example.com',
      });

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          replyTo: 'reply@example.com',
        }),
      );
    });

    it('normalizes email addresses', async () => {
      await emailService.sendEmail({
        to: ' Test@Example.COM ',
        subject: 'Test',
        html: '<p>Test</p>',
      });

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'test@example.com',
        }),
      );
    });

    it('throws error when Resend API returns error', async () => {
      mockSend.mockResolvedValue({
        data: null,
        error: { message: 'Invalid API key' },
      });

      await expect(
        emailService.sendEmail({
          to: 'test@example.com',
          subject: 'Test',
          html: '<p>Test</p>',
        }),
      ).rejects.toMatchObject({
        statusCode: 500,
        message: 'Failed to send email',
      });
    });

    it('throws error when send fails', async () => {
      mockSend.mockRejectedValue(new Error('Network error'));

      await expect(
        emailService.sendEmail({
          to: 'test@example.com',
          subject: 'Test',
          html: '<p>Test</p>',
        }),
      ).rejects.toMatchObject({
        statusCode: 500,
        message: 'Failed to send email',
      });
    });

    it('validates email format', async () => {
      await expect(
        emailService.sendEmail({
          to: 'invalid-email',
          subject: 'Test',
          html: '<p>Test</p>',
        }),
      ).rejects.toThrow();
    });

    it('validates required fields', async () => {
      await expect(
        emailService.sendEmail({
          to: 'test@example.com',
          subject: '',
          html: '<p>Test</p>',
        }),
      ).rejects.toThrow();
    });
  });

  describe('sendTemplateEmail', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockTemplate = { name: 'TestTemplate' } as any;

    it('renders template and sends email', async () => {
      mockRender
        .mockResolvedValueOnce('<html>rendered html</html>')
        .mockResolvedValueOnce('rendered text');

      const result = await emailService.sendTemplateEmail({
        to: 'test@example.com',
        subject: 'Test Template',
        template: mockTemplate,
        props: { name: 'John' },
      });

      expect(result).toEqual({ id: 'test-email-id' });

      // Check render was called twice (HTML + text)
      expect(mockRender).toHaveBeenCalledTimes(2);
      expect(mockRender).toHaveBeenNthCalledWith(
        1,
        mockTemplate,
        { name: 'John' },
        { pretty: expect.any(Boolean) },
      );
      expect(mockRender).toHaveBeenNthCalledWith(2, mockTemplate, { name: 'John' }, { plainText: true });

      // Check email was sent with rendered content
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          html: '<html>rendered html</html>',
          text: 'rendered text',
        }),
      );
    });

    it('passes custom from and replyTo to sendEmail', async () => {
      await emailService.sendTemplateEmail({
        to: 'test@example.com',
        subject: 'Test',
        template: mockTemplate,
        props: {},
        from: 'custom@example.com',
        replyTo: 'reply@example.com',
      });

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'custom@example.com',
          replyTo: 'reply@example.com',
        }),
      );
    });
  });

  describe('sendEmailVerification', () => {
    it('sends verification email with correct params', async () => {
      const result = await emailService.sendEmailVerification({
        to: 'test@example.com',
        name: 'Test User',
        verificationLink: 'https://example.com/verify?token=abc',
      });

      expect(result).toEqual({ id: 'test-email-id' });
      expect(mockRender).toHaveBeenCalled();
    });

    it('includes email in props', async () => {
      await emailService.sendEmailVerification({
        to: 'user@example.com',
        name: 'User',
        verificationLink: 'https://example.com/verify',
      });

      expect(mockRender).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          email: 'user@example.com',
          name: 'User',
          verificationLink: 'https://example.com/verify',
        }),
        expect.anything(),
      );
    });
  });
});
