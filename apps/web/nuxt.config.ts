// https://nuxt.com/docs/api/configuration/nuxt-config
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/content', '@nuxt/ui'],

  devtools: {
    enabled: true,
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    authSecret: process.env.AUTH_SECRET,
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    resendApiKey: process.env.RESEND_API_KEY,
    resendFromEmail: process.env.RESEND_FROM_EMAIL,
    public: {
      appUrl: process.env.APP_URL || 'http://localhost:3000',
      oauthGithubEnabled: !!process.env.GITHUB_CLIENT_ID && !!process.env.GITHUB_CLIENT_SECRET,
      oauthGoogleEnabled: !!process.env.GOOGLE_CLIENT_ID && !!process.env.GOOGLE_CLIENT_SECRET,
      publicRoutes: [
        '/',
        '/auth/login',
        '/auth/register',
        '/auth/verify-email',
        '/auth/forgot-password',
        '/auth/forgot-password-sent',
        '/auth/reset-password',
        '/auth/magic-link',
        '/auth/magic-link-sent',
        '/api/auth/verify-email',
        '/blog',
        '/blog/*',
        '/docs',
        '/docs/*',
        '/legal/privacy',
        '/legal/terms',
      ],
    },
  },

  alias: {
    '#shared': resolve(__dirname, './shared'),
  },

  routeRules: {
    '/': { prerender: true },
  },

  compatibilityDate: '2025-01-15',
  nitro: {
    rollupConfig: {
      plugins: [vue()],
    },
    externals: {
      inline: ['@prisma/client'],
    },
  },

  vite: {
    optimizeDeps: {
      exclude: ['@prisma/client', '@prisma/adapter-pg'],
    },
    resolve: {
      alias: {
        '.prisma/client/index-browser': './node_modules/.prisma/client/index-browser.js',
      },
    },
  },

  typescript: {
    tsConfig: {
      include: ['./shared/**/*.ts'],
    },
  },
  eslint: {
    config: {
      stylistic: {
        semi: true,
      },
    },
  },
});
