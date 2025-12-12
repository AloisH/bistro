import { describe, it, expect } from 'vitest';
import { render } from '@vue-email/render';
import AccountDeletion from './AccountDeletion.vue';

describe('AccountDeletion template', () => {
  it('renders with name', async () => {
    const html = await render(AccountDeletion, {
      name: 'Test User',
    });

    expect(html).toContain('Hi Test User,');
    expect(html).toContain('Your account has been deleted');
    expect(html).toContain('permanently deleted');
    expect(html).toContain('cannot be undone');
  });

  it('renders without name (generic greeting)', async () => {
    const html = await render(AccountDeletion, {});

    expect(html).toContain('Hi there,');
    expect(html).toContain('Your account has been deleted');
    expect(html).toContain('permanently deleted');
  });

  it('renders plain text version', async () => {
    const text = await render(AccountDeletion, { name: 'Test User' }, { plainText: true });

    expect(text).toContain('YOUR ACCOUNT HAS BEEN DELETED');
    expect(text).toContain('permanently deleted');
    expect(text).toContain('cannot be undone');
  });

  it('includes preview text', async () => {
    const html = await render(AccountDeletion, { name: 'Test' });

    expect(html).toContain('Your Bistro account has been deleted');
  });

  it('includes deletion confirmation', async () => {
    const html = await render(AccountDeletion, { name: 'Jane' });

    expect(html).toContain('permanently deleted');
    expect(html).toContain('cannot be undone');
  });

  it('includes security warning', async () => {
    const html = await render(AccountDeletion, { name: 'Test' });

    expect(html).toContain('request this deletion');
    expect(html).toContain('accessed your account');
  });

  it('includes data removal notice', async () => {
    const html = await render(AccountDeletion, { name: 'Test' });

    expect(html).toContain('projects');
    expect(html).toContain('settings');
    expect(html).toContain('personal information');
    expect(html).toContain('removed from our systems');
  });
});
