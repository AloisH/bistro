<template>
  <UApp>
    <UHeader class="border-b border-default bg-default sticky top-0 z-50">
      <template #left>
        <NuxtLink
          to="/"
          class="flex items-center gap-2"
        >
          <AppLogo class="h-6 w-auto shrink-0" />
        </NuxtLink>

        <div class="hidden md:flex items-center gap-1 ml-6">
          <UButton
            to="/blog"
            color="neutral"
            variant="ghost"
          >
            Blog
          </UButton>
          <UButton
            to="/docs"
            color="neutral"
            variant="ghost"
          >
            Docs
          </UButton>
        </div>
      </template>

      <template #right>
        <div class="flex items-center gap-2">
          <AuthButton />

          <UColorModeButton />

          <UButton
            to="https://github.com/nuxt-ui-templates/starter"
            target="_blank"
            icon="i-simple-icons-github"
            aria-label="GitHub"
            color="neutral"
            variant="ghost"
            class=""
          />
        </div>
      </template>
    </UHeader>

    <UMain>
      <slot />
    </UMain>

    <USeparator icon="i-simple-icons-nuxtdotjs" />

    <UFooter class="border-t border-default">
      <template #left>
        <div class="flex items-center gap-4 text-sm">
          <p class="text-muted">
            Built with <span class="text-primary font-semibold">Nuxt UI</span> • © {{ new Date().getFullYear() }}
          </p>
          <span class="text-neutral-300 dark:text-neutral-700">•</span>
          <ULink
            to="/legal/privacy"
            class="text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors"
          >
            Privacy
          </ULink>
          <ULink
            to="/legal/terms"
            class="text-neutral-600 dark:text-neutral-400 hover:text-primary transition-colors"
          >
            Terms
          </ULink>
        </div>
      </template>

      <template #right>
        <UButton
          to="/rss.xml"
          icon="i-lucide-rss"
          aria-label="RSS Feed"
          color="neutral"
          variant="ghost"
          class=""
        />
        <UButton
          to="https://github.com/nuxt-ui-templates/starter"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
          class=""
        />
      </template>
    </UFooter>
  </UApp>
</template>
