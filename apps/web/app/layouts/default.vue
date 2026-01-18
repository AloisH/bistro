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

      <template #center>
        <div class="flex gap-6 text-sm">
          <NuxtLink
            to="/#features"
            class="hover:text-primary transition-colors"
          >
            Features
          </NuxtLink>
          <NuxtLink
            to="/#pricing"
            class="hover:text-primary transition-colors"
          >
            Pricing
          </NuxtLink>
          <NuxtLink
            to="/blog"
            class="hover:text-primary transition-colors"
          >
            Blog
          </NuxtLink>
          <NuxtLink
            to="/changelog"
            class="hover:text-primary transition-colors"
          >
            Changelog
          </NuxtLink>
          <NuxtLink
            to="/#faq"
            class="hover:text-primary transition-colors"
          >
            FAQ
          </NuxtLink>
          <NuxtLink
            to="https://github.com/AloisH/bistro"
            target="_blank"
            class="hover:text-primary transition-colors"
          >
            GitHub
          </NuxtLink>
          <NuxtLink
            to="/contact"
            class="hover:text-primary transition-colors"
          >
            Contact
          </NuxtLink>
        </div>
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
  { label: 'Contact', to: '/contact' },
];
</script>
