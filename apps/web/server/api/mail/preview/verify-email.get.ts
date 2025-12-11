import { render } from '@vue-email/render';
import VerifyEmail from '../../../mail/template/VerifyEmail.vue';

export default defineEventHandler(async () => {
  return await render(
    VerifyEmail,
    {
      name: 'John Doe',
      verificationLink: 'http://localhost:3000/api/auth/verify-email?token=mock-token-123',
      email: 'john@example.com',
    },
    { pretty: true },
  );
});
