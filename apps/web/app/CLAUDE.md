# App Context (apps/web/app/)

Client-side Nuxt code - pages, components, composables, middleware.

## Structure

```
app/
├── app.vue              # Root layout (UApp wrapper)
├── app.config.ts        # Nuxt UI theme config
├── pages/               # File-based routes
│   ├── index.vue        # /
│   ├── dashboard.vue    # /dashboard (protected)
│   └── auth/
│       ├── login.vue    # /auth/login
│       └── register.vue # /auth/register
├── components/          # Auto-imported
│   ├── AppLogo.vue
│   ├── AuthButton.vue
│   ├── AuthOAuthButtons.vue
│   └── TemplateMenu.vue
├── composables/         # Auto-imported
│   └── useAuth.ts       # Auth state & methods
├── middleware/          # Route guards
│   └── auth.global.ts   # Global auth check
└── assets/
    └── css/main.css     # Global styles
```

## Pages (File-Based Routing)

**Convention:**

- `pages/index.vue` → `/`
- `pages/dashboard.vue` → `/dashboard`
- `pages/auth/login.vue` → `/auth/login`
- `pages/user/[id].vue` → `/user/:id`

**Layout:**

```vue
<template>
  <div>
    <h1>Page Title</h1>
    <p>Content</p>
  </div>
</template>

<script setup lang="ts">
// Auto-import composables
const { user, loggedIn } = useAuth();

// Auto-import Nuxt functions
const route = useRoute();
const router = useRouter();
</script>
```

## Components

**Auto-imported from `components/`:**

```vue
<template>
  <!-- No import needed for AppLogo, AuthButton, etc -->
  <UCard>
    <AppLogo />
    <AuthButton />
  </UCard>
</template>
```

**Nuxt UI components (always available):**

- Layout: `UApp`, `UHeader`, `UMain`, `UFooter`
- Forms: `UForm`, `UFormField`, `UInput`, `UButton`
- Feedback: `UAlert`, `UToast` (via `useToast()`)
- Navigation: `ULink`, `NuxtLink`
- Utilities: `UColorModeButton`, `UIcon`, `UModal`

**IMPORTANT: Always check Nuxt UI documentation**

- Before using any Nuxt UI component, check https://ui.nuxt.com
- Color props: Use `error`, `success`, `warning`, `info`, `primary`, `neutral` (NOT `red`, `green`, etc.)
- Modal usage: Use `v-model:open` with `#content` slot
- Toast notifications: Use `useToast()` composable for success/error feedback

**Testing:**

```typescript
// Place next to component: AuthButton.test.ts
import { describe, it, expect } from 'vitest';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import AuthButton from './AuthButton.vue';

describe('AuthButton', () => {
  it('renders', async () => {
    const wrapper = await mountSuspended(AuthButton);
    expect(wrapper.html()).toContain('Login');
  });
});
```

## Composables (useAuth)

**Pattern:**

```typescript
// Auto-imported, no import needed
const {
  session, // Ref<Session | null>
  user, // Ref<User | null>
  loggedIn, // Computed<boolean>
  isPending, // Ref<boolean>
  signIn, // { email, social }
  signUp, // { email }
  signOut, // ({ redirectTo })
  fetchSession, // () => Promise<SessionData>
  client, // Better Auth client
} = useAuth();
```

**Usage:**

```vue
<script setup lang="ts">
const { user, loggedIn, signOut } = useAuth();

async function handleLogout() {
  await signOut({ redirectTo: '/auth/login' });
}
</script>

<template>
  <div v-if="loggedIn">
    <p>Welcome {{ user?.name }}</p>
    <UButton @click="handleLogout">Logout</UButton>
  </div>
</template>
```

**OAuth callback handling:**

```typescript
onMounted(async () => {
  // Better Auth redirects to login page after OAuth
  await fetchSession(); // Fetch updated session
  if (loggedIn.value) {
    await navigateTo('/dashboard');
  }
});
```

## Middleware (Route Guards)

**Global auth middleware (auth.global.ts):**

- Runs on every route change
- Reads publicRoutes from nuxt.config.ts
- Redirects to /auth/login if not authenticated

**Adding public routes:**

```typescript
// Update nuxt.config.ts (NOT middleware):
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      publicRoutes: [
        '/',
        '/auth/login',
        '/auth/register',
        '/pricing', // ← Add new public route here
      ],
    },
  },
});
```

**Page-specific middleware:**

```vue
<script setup lang="ts">
definePageMeta({
  middleware: ['auth'], // Apply specific middleware
});
</script>
```

## Forms (Zod Validation)

**Pattern:**

```vue
<script setup lang="ts">
import { z } from 'zod';

const state = reactive({
  email: '',
  password: '',
});

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 chars'),
});

const loading = ref(false);
const error = ref('');

async function onSubmit() {
  loading.value = true;
  error.value = '';
  try {
    // API call
  } catch (e) {
    error.value = 'Error occurred';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <UForm :state="state" :schema="schema" @submit="onSubmit">
    <UFormField name="email" label="Email">
      <UInput v-model="state.email" type="email" />
    </UFormField>
    <UButton type="submit" :loading="loading">Submit</UButton>
  </UForm>
</template>
```

## Toast Notifications

**Use toast for success/error feedback:**

```vue
<script setup lang="ts">
const toast = useToast();

async function onSubmit() {
  try {
    // API call
    toast.add({
      title: 'Success',
      description: 'Action completed',
      color: 'success',
      icon: 'i-lucide-check',
    });
  } catch (e) {
    toast.add({
      title: 'Error',
      description: 'Something went wrong',
      color: 'error',
      icon: 'i-lucide-alert-triangle',
    });
  }
}
</script>
```

## Styling

**Tailwind classes (Nuxt UI v4):**

```vue
<template>
  <div class="flex min-h-screen items-center justify-center p-4">
    <UCard class="w-full max-w-md">
      <!-- Content -->
    </UCard>
  </div>
</template>
```

**Dark mode:**

- Automatic via `UColorModeButton`
- Use `dark:` prefix for dark mode styles
- Example: `text-gray-500 dark:text-gray-400`

## OAuth Conditional UI

**Pattern (see AuthOAuthButtons.vue):**

```vue
<script setup lang="ts">
const config = useRuntimeConfig();

const hasOAuth = computed(
  () => config.public.oauthGithubEnabled || config.public.oauthGoogleEnabled,
);
</script>

<template>
  <div v-if="hasOAuth">
    <UButton v-if="config.public.oauthGithubEnabled" @click="signInWithGithub">
      Continue with GitHub
    </UButton>
    <UButton v-if="config.public.oauthGoogleEnabled" @click="signInWithGoogle">
      Continue with Google
    </UButton>
  </div>
</template>
```
