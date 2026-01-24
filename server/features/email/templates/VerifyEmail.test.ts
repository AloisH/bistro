import { describe, it, expect } from 'vitest';
import { render } from '@vue-email/render';
import VerifyEmail from './VerifyEmail.vue';

describe('VerifyEmail template', () => {
  it('renders with all props', async () => {
    const html = await render(VerifyEmail, {
      name: 'Test User',
      verificationLink: 'https://example.com/verify?token=abc123',
      email: 'test@example.com',
    });

    expect(html).toContain('Test User');
    expect(html).toContain('https://example.com/verify?token=abc123');
    expect(html).toContain('test@example.com');
    expect(html).toContain('24 hours');
    expect(html).toContain('Verify Email Address');
  });

  it('renders without optional email', async () => {
    const html = await render(VerifyEmail, {
      name: 'Test User',
      verificationLink: 'https://example.com/verify',
    });

    expect(html).toContain('Test User');
    expect(html).toContain('https://example.com/verify');
    expect(html).toContain('Verify Email Address');
  });

  it('renders plain text version', async () => {
    const text = await render(
      VerifyEmail,
      { name: 'Test User', verificationLink: 'https://example.com' },
      { plainText: true },
    );

    // Plain text renders name in uppercase in heading
    expect(text).toContain('BISTRO');
    expect(text).toContain('https://example.com');
    expect(text).toContain('Verify Email Address');
  });

  it('includes preview text', async () => {
    const html = await render(VerifyEmail, {
      name: 'Test',
      verificationLink: 'https://example.com',
    });

    expect(html).toContain('Verify your email for Bistro');
  });

  it('includes welcome message', async () => {
    const html = await render(VerifyEmail, {
      name: 'Jane',
      verificationLink: 'https://example.com',
    });

    expect(html).toContain('Welcome to Bistro, Jane!');
  });

  it('includes expiry notice', async () => {
    const html = await render(VerifyEmail, {
      name: 'Test',
      verificationLink: 'https://example.com',
    });

    expect(html).toContain('expire');
    expect(html).toContain('24 hours');
  });
});
