<template>
  <UApp>
    <UHeader class="border-b border-gray-200/80 backdrop-blur-md bg-white/80 dark:bg-gray-950/80 dark:border-gray-800/80 sticky top-0 z-50">
      <template #left>
        <NuxtLink
          to="/"
          class="group flex items-center gap-2 transition-all duration-200 hover:scale-105"
        >
          <AppLogo class="h-6 w-auto shrink-0 transition-transform group-hover:rotate-2" />
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

          <UColorModeButton class="transition-transform hover:rotate-180 duration-500" />

          <UButton
            to="https://github.com/nuxt-ui-templates/starter"
            target="_blank"
            icon="i-simple-icons-github"
            aria-label="GitHub"
            color="neutral"
            variant="ghost"
            class="transition-all hover:scale-110"
          />
        </div>
      </template>
    </UHeader>

    <UMain>
      <slot />
    </UMain>

    <USeparator icon="i-simple-icons-nuxtdotjs" />

    <UFooter class="border-t border-gray-200/50 dark:border-gray-800/50">
      <template #left>
        <div class="flex items-center gap-4 text-sm">
          <p class="text-muted">
            Built with <span class="text-primary font-semibold">Nuxt UI</span> • © {{ new Date().getFullYear() }}
          </p>
          <span class="text-gray-300 dark:text-gray-700">•</span>
          <ULink
            to="/legal/privacy"
            class="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
          >
            Privacy
          </ULink>
          <ULink
            to="/legal/terms"
            class="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
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
          class="transition-all hover:scale-110"
        />
        <UButton
          to="https://github.com/nuxt-ui-templates/starter"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
          class="transition-all hover:scale-110"
        />
      </template>
    </UFooter>
  </UApp>
</template>
