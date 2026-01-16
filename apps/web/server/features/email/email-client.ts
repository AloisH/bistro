import { Resend } from 'resend';
import { getLogger } from '../../utils/logger';

const globalForResend = globalThis as unknown as {
  resend: Resend | undefined;
};

function createResendClient(): Resend | undefined {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    getLogger().warn('RESEND_API_KEY not set - email disabled');
    return undefined;
  }

  return new Resend(apiKey);
}

export const resend = globalForResend.resend ?? createResendClient();

if (process.env.NODE_ENV !== 'production') {
  globalForResend.resend = resend;
}
