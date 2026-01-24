import { describe, it, expect } from 'vitest';
import { render } from '@vue-email/render';
import MagicLinkEmail from './MagicLinkEmail.vue';

describe('MagicLinkEmail template', () => {
  it('renders with all props', async () => {
    const html = await render(MagicLinkEmail, {
      magicLink: 'https://example.com/api/auth/magic-link/verify?token=abc123',
      email: 'test@example.com',
    });

    expect(html).toContain('https://example.com/api/auth/magic-link/verify?token=abc123');
    expect(html).toContain('test@example.com');
    expect(html).toContain('15 minutes');
    expect(html).toContain('Sign in to Bistro');
  });

  it('renders without optional email', async () => {
    const html = await render(MagicLinkEmail, {
      magicLink: 'https://example.com/api/auth/magic-link/verify?token=xyz',
    });

    expect(html).toContain('https://example.com/api/auth/magic-link/verify?token=xyz');
    expect(html).toContain('Sign in to Bistro');
    expect(html).not.toContain('This email was sent to');
  });

  it('renders plain text version', async () => {
    const text = await render(
      MagicLinkEmail,
      { magicLink: 'https://example.com/verify' },
      { plainText: true },
    );

    expect(text).toContain('BISTRO');
    expect(text).toContain('https://example.com/verify');
    expect(text).toContain('Sign in to Bistro');
  });

  it('includes preview text', async () => {
    const html = await render(MagicLinkEmail, {
      magicLink: 'https://example.com',
    });

    expect(html).toContain('Your login link for Bistro');
  });

  it('includes sign in message', async () => {
    const html = await render(MagicLinkEmail, {
      magicLink: 'https://example.com',
    });

    expect(html).toContain('Sign in to Bistro');
    expect(html).toContain('No password needed');
  });

  it('includes expiry notice', async () => {
    const html = await render(MagicLinkEmail, {
      magicLink: 'https://example.com',
    });

    expect(html).toContain('expire');
    expect(html).toContain('15 minutes');
  });

  it('includes fallback link', async () => {
    const html = await render(MagicLinkEmail, {
      magicLink: 'https://example.com/test',
    });

    expect(html).toContain('copy and paste');
    expect(html).toContain('https://example.com/test');
  });
});
