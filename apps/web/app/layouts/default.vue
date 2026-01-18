<template>
  <div>
    <UBanner
      id="announcement-v1"
      icon="i-lucide-sparkles"
      title="New: Command palette search with Cmd+K"
      to="https://github.com/AloisH/bistro"
      target="_blank"
      :close="true"
    />

    <UHeader :links="navLinks">
      <template #left>
        <NuxtLink
          to="/"
          class="flex items-center gap-2"
        >
          <UIcon
            name="i-lucide-check-square"
            class="size-6 text-primary"
          />
          <span class="font-bold text-lg">Bistro</span>
        </NuxtLink>

        <nav class="hidden md:flex items-center gap-1 ml-6">
          <UButton
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            variant="ghost"
            color="neutral"
          >
            {{ link.label }}
          </UButton>
        </nav>
      </template>

      <template #right>
        <UColorModeButton />
        <UButton
          to="/auth/login"
          variant="ghost"
        >
          Sign in
        </UButton>
        <UButton to="/auth/register">
          Get Started
        </UButton>
      </template>
    </UHeader>

    <UMain>
      <slot />
    </UMain>

    <UFooter>
      <template #top>
        <UContainer>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 py-8">
            <!-- Product Column -->
            <div>
              <h3 class="font-semibold text-sm mb-4 text-foreground">
                Product
              </h3>
              <ul class="space-y-3">
                <li
                  v-for="link in footerColumns.product"
                  :key="link.to"
                >
                  <NuxtLink
                    :to="link.to"
                    class="text-sm text-muted hover:text-primary transition-colors"
                  >
                    {{ link.label }}
                  </NuxtLink>
                </li>
              </ul>
            </div>

            <!-- Resources Column -->
            <div>
              <h3 class="font-semibold text-sm mb-4 text-foreground">
                Resources
              </h3>
              <ul class="space-y-3">
                <li
                  v-for="link in footerColumns.resources"
                  :key="link.to"
                >
                  <NuxtLink
                    :to="link.to"
                    :target="link.external ? '_blank' : undefined"
                    class="text-sm text-muted hover:text-primary transition-colors"
                  >
                    {{ link.label }}
                  </NuxtLink>
                </li>
              </ul>
            </div>

            <!-- Legal Column -->
            <div>
              <h3 class="font-semibold text-sm mb-4 text-foreground">
                Legal
              </h3>
              <ul class="space-y-3">
                <li
                  v-for="link in footerColumns.legal"
                  :key="link.to"
                >
                  <NuxtLink
                    :to="link.to"
                    class="text-sm text-muted hover:text-primary transition-colors"
                  >
                    {{ link.label }}
                  </NuxtLink>
                </li>
              </ul>
            </div>

            <!-- Company Column -->
            <div>
              <h3 class="font-semibold text-sm mb-4 text-foreground">
                Company
              </h3>
              <ul class="space-y-3">
                <li
                  v-for="link in footerColumns.company"
                  :key="link.to"
                >
                  <NuxtLink
                    :to="link.to"
                    class="text-sm text-muted hover:text-primary transition-colors"
                  >
                    {{ link.label }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </UContainer>
      </template>

      <template #left>
        <div class="flex items-center gap-2">
          <UIcon
            name="i-lucide-check-square"
            class="size-5 text-primary"
          />
          <span class="font-semibold">Bistro</span>
        </div>
        <p class="text-sm text-muted mt-1">
          Open source todo app built with Nuxt.
        </p>
      </template>

      <template #default>
        <p class="text-sm text-muted">
          &copy; {{ new Date().getFullYear() }} Bistro. All rights reserved.
        </p>
      </template>

      <template #right>
        <div class="flex gap-2">
          <UButton
            to="https://github.com/AloisH/bistro"
            target="_blank"
            icon="i-simple-icons-github"
            color="neutral"
            variant="ghost"
            aria-label="GitHub"
          />
          <UButton
            to="https://twitter.com"
            target="_blank"
            icon="i-simple-icons-x"
            color="neutral"
            variant="ghost"
            aria-label="Twitter/X"
          />
          <UColorModeButton
            color="neutral"
            variant="ghost"
          />
        </div>
      </template>
    </UFooter>
  </div>
</template>

<script setup lang="ts">
const navLinks = [
  { label: 'Features', to: '/#features' },
  { label: 'Pricing', to: '/#pricing' },
  { label: 'Blog', to: '/blog' },
  { label: 'Changelog', to: '/changelog' },
  { label: 'FAQ', to: '/#faq' },
];

const footerColumns = {
  product: [
    { label: 'Features', to: '/#features' },
    { label: 'Pricing', to: '/#pricing' },
    { label: 'Changelog', to: '/changelog' },
    { label: 'FAQ', to: '/#faq' },
  ],
  resources: [
    { label: 'Documentation', to: '/docs' },
    { label: 'Blog', to: '/blog' },
    { label: 'GitHub', to: 'https://github.com/AloisH/bistro', external: true },
  ],
  legal: [
    { label: 'Privacy Policy', to: '/legal/privacy' },
    { label: 'Terms of Service', to: '/legal/terms' },
  ],
  company: [
    { label: 'About', to: '/#features' },
    { label: 'Contact', to: '/contact' },
  ],
};
</script>
