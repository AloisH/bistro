import { describe, it, expect } from 'vitest';
import { render } from '@vue-email/render';
import ResetPasswordEmail from './ResetPasswordEmail.vue';

describe('ResetPasswordEmail template', () => {
  it('renders with all props', async () => {
    const html = await render(ResetPasswordEmail, {
      name: 'Test User',
      resetLink: 'https://example.com/reset?token=abc123',
      email: 'test@example.com',
    });

    expect(html).toContain('Test User');
    expect(html).toContain('https://example.com/reset?token=abc123');
    expect(html).toContain('test@example.com');
    expect(html).toContain('1 hour');
    expect(html).toContain('Reset Password');
  });

  it('renders without optional email', async () => {
    const html = await render(ResetPasswordEmail, {
      name: 'Test User',
      resetLink: 'https://example.com/reset',
    });

    expect(html).toContain('Test User');
    expect(html).toContain('https://example.com/reset');
    expect(html).toContain('Reset Password');
  });

  it('renders plain text version', async () => {
    const text = await render(
      ResetPasswordEmail,
      { name: 'Test User', resetLink: 'https://example.com' },
      { plainText: true },
    );

    expect(text).toContain('https://example.com');
    expect(text).toContain('Reset Password');
  });

  it('includes preview text', async () => {
    const html = await render(ResetPasswordEmail, {
      name: 'Test',
      resetLink: 'https://example.com',
    });

    expect(html).toContain('Reset your Bistro password');
  });

  it('includes expiry notice', async () => {
    const html = await render(ResetPasswordEmail, {
      name: 'Test',
      resetLink: 'https://example.com',
    });

    expect(html).toContain('expire');
    expect(html).toContain('1 hour');
  });

  it('includes security notice', async () => {
    const html = await render(ResetPasswordEmail, {
      name: 'Test',
      resetLink: 'https://example.com',
    });

    expect(html).toContain('request a password reset');
    expect(html).toContain('safely ignore');
  });
});
