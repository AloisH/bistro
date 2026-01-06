# Auth UI

Authentication components and state management.

## Components

- `AuthButton.vue` - Header login button or user avatar dropdown (profile, logout, admin panel)
- `AuthOAuthButtons.vue` - OAuth provider buttons (GitHub, Google) - conditional rendering

## Composables

- `composables/auth/useAuth.ts` - Main auth state
  - `session`, `user`, `isPending`, `loggedIn` - Reactive auth state
  - `client` - Better Auth client
  - `signIn.email(email, password)`, `signIn.social(provider)` - Sign in methods
  - `signUp.email(email, password, name)` - Sign up
  - `signOut({ redirectTo })` - Sign out
  - `fetchSession()` - Refresh session (needed after OAuth callback)

- `composables/auth/useRole.ts` - Role-based access
  - `role`, `isAdmin`, `isSuperAdmin`, `isUser` - Role checks
  - `hasRole(roles)` - Check if user has any of the roles

- `composables/auth/useAuthRedirect.ts` - Post-login redirect logic
  - `redirectAfterAuth()` - Redirect to intended page or dashboard

## Dependencies

- Server: `/api/auth/[...]` (Better Auth)
- Composables: Auto-imported

## Usage

```vue
<script setup lang="ts">
const { user, loggedIn, signOut } = useAuth();
const { isSuperAdmin } = useRole();

async function handleLogout() {
  await signOut({ redirectTo: '/' });
}
</script>

<template>
  <AuthButton />
  <div v-if="isSuperAdmin">Admin Panel Link</div>
</template>
```

**AuthOAuthButtons pattern:**

- Conditional rendering based on env vars
- Shows only enabled providers
- Runtime check via `useRuntimeConfig()`

See: [server/features/auth/auth.md](../../../server/features/auth/auth.md) for server setup
