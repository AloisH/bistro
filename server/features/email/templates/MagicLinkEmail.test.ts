import { describe, it, expect } from 'vitest';
import { render } from '@vue-email/render';
import MagicLinkEmail from './MagicLinkEmail.vue';

describe('MagicLinkEmail template', () => {
  it('renders html with all props', async () => {
    const html = await render(MagicLinkEmail, {
      magicLink: 'https://example.com/api/auth/magic-link/verify?token=abc123',
      email: 'test@example.com',
    });

    expect(html).toMatchSnapshot();
  });

  it('renders html without optional email', async () => {
    const html = await render(MagicLinkEmail, {
      magicLink: 'https://example.com/api/auth/magic-link/verify?token=xyz',
    });

    expect(html).toMatchSnapshot();
  });

  it('renders plain text', async () => {
    const text = await render(
      MagicLinkEmail,
      { magicLink: 'https://example.com/verify' },
      { plainText: true },
    );

    expect(text).toMatchSnapshot();
  });
});
