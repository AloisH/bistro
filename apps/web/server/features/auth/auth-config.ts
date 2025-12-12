import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { magicLink } from 'better-auth/plugins';
import { db } from '../../utils/db';
import { emailService } from '../email/email-service';

// Build socialProviders config conditionally based on env vars
const socialProviders: Record<string, { clientId: string; clientSecret: string }> = {};

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  };
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }: { user: { email: string; name: string }; url: string }) => {
      if (!emailService.isConfigured()) {
        console.warn('[Auth] Password reset disabled - RESEND_API_KEY not set');
        return;
      }

      try {
        await emailService.sendPasswordReset({
          to: user.email,
          name: user.name,
          resetLink: url,
        });
        console.log(`[Auth] Password reset email sent to ${user.email}`);
      } catch (error) {
        console.error('[Auth] Failed to send password reset email:', error);
      }
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60 * 24, // 24 hours
    sendVerificationEmail: async ({ user, url }) => {
      if (!emailService.isConfigured()) {
        console.warn('[Auth] Email verification disabled - RESEND_API_KEY not set');
        return;
      }

      try {
        await emailService.sendEmailVerification({
          to: user.email,
          name: user.name,
          verificationLink: url,
        });
        console.log(`[Auth] Verification email sent to ${user.email}`);
      } catch (error) {
        console.error('[Auth] Failed to send verification email:', error);
        // Don't throw - allow registration even if email fails
      }
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  trustedOrigins: [process.env.AUTH_TRUST_HOST || 'http://localhost:3000'],
  socialProviders,
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        if (!emailService.isConfigured()) {
          console.warn('[Auth] Magic link disabled - RESEND_API_KEY not set');
          return;
        }

        try {
          await emailService.sendMagicLink({
            to: email,
            magicLink: url,
          });
          console.log(`[Auth] Magic link sent to ${email}`);
        } catch (error) {
          console.error('[Auth] Failed to send magic link:', error);
        }
      },
      expiresIn: 60 * 15, // 15 min
      disableSignUp: false, // Allow new user registration
    }),
  ],
});
