<script setup lang="ts">
import type { FooterColumn, NavigationMenuItem } from '@nuxt/ui';

const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();

const navLinks = computed<NavigationMenuItem[][]>(() => [
  [
    {
      label: t('nav.features'),
      to: localePath('/#features'),
      active: route.hash === '#features',
    },
    {
      label: t('nav.pricing'),
      to: localePath('/#pricing'),
      active: route.hash === '#pricing',
    },
    {
      label: t('nav.blog'),
      to: localePath('/blog'),
      active: route.path.startsWith('/blog') || route.path.startsWith('/fr/blog'),
    },
    {
      label: t('nav.docs'),
      to: localePath('/docs'),
      active: route.path.startsWith('/docs') || route.path.startsWith('/fr/docs'),
    },
    {
      label: t('nav.changelog'),
      to: localePath('/changelog'),
      active: route.path.startsWith('/changelog') || route.path.startsWith('/fr/changelog'),
    },
    {
      label: t('nav.contact'),
      to: localePath('/contact'),
      active: route.path === '/contact' || route.path === '/fr/contact',
    },
  ],
]);

const footerColumns = computed<FooterColumn[]>(() => [
  {
    label: t('footer.product'),
    children: [
      { label: t('nav.features'), to: localePath('/#features') },
      { label: t('nav.pricing'), to: localePath('/#pricing') },
      { label: t('nav.changelog'), to: localePath('/changelog') },
      { label: t('footer.faq'), to: localePath('/#faq') },
    ],
  },
  {
    label: t('footer.resources'),
    children: [
      { label: t('footer.documentation'), to: localePath('/docs') },
      { label: t('nav.blog'), to: localePath('/blog') },
      { label: 'GitHub', to: 'https://github.com/AloisH/bistro', target: '_blank' },
    ],
  },
  {
    label: t('footer.legal'),
    children: [
      { label: t('footer.privacyPolicy'), to: localePath('/legal/privacy') },
      { label: t('footer.termsOfService'), to: localePath('/legal/terms') },
    ],
  },
  {
    label: t('footer.company'),
    children: [
      { label: t('footer.about'), to: localePath('/#features') },
      { label: t('nav.contact'), to: localePath('/contact') },
    ],
  },
]);
</script>

<template>
  <div>
    <UBanner
      id="announcement-v1"
      icon="i-lucide-sparkles"
      :title="$t('banner.announcement')"
      to="https://github.com/AloisH/bistro"
      target="_blank"
      :close="true"
    />

    <UHeader :links="navLinks">
      <template #left>
        <NuxtLink
          :to="localePath('/')"
          class="flex items-center gap-2"
        >
          <UIcon
            name="i-lucide-check-square"
            class="text-primary size-6"
          />
          <span class="text-lg font-bold">Bistro</span>
        </NuxtLink>

        <UNavigationMenu
          :items="navLinks"
          class="ml-6 hidden md:flex"
        />
      </template>

      <template #right>
        <LocaleSwitcher class="hidden md:flex" />
        <UColorModeButton class="hidden md:flex" />
        <UButton
          :to="localePath('/auth/login')"
          variant="ghost"
          class="hidden sm:flex"
        >
          {{ $t('common.signIn') }}
        </UButton>
        <UButton :to="localePath('/auth/register')">
          {{ $t('common.getStarted') }}
        </UButton>
      </template>

      <template #body>
        <UNavigationMenu
          :items="navLinks"
          orientation="vertical"
          class="w-full"
        />
        <USeparator class="my-4" />
        <div class="flex flex-col gap-2">
          <UButton
            :to="localePath('/auth/login')"
            variant="ghost"
            block
          >
            {{ $t('common.signIn') }}
          </UButton>
          <UButton
            :to="localePath('/auth/register')"
            block
          >
            {{ $t('common.getStarted') }}
          </UButton>
        </div>
      </template>
    </UHeader>

    <UMain>
      <slot />
    </UMain>

    <UFooter>
      <template #top>
        <UContainer>
          <UFooterColumns :columns="footerColumns">
            <template #right>
              <div class="flex flex-col gap-4">
                <p class="text-sm font-semibold">
                  {{ $t('footer.followUs') }}
                </p>
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
                </div>
              </div>
            </template>
          </UFooterColumns>
        </UContainer>
      </template>

      <template #left>
        <div class="flex items-center gap-2">
          <UIcon
            name="i-lucide-check-square"
            class="text-primary size-5"
          />
          <span class="font-semibold">Bistro</span>
        </div>
        <p class="text-muted mt-1 text-sm">
          {{ $t('footer.tagline') }}
        </p>
      </template>

      <template #default>
        <p class="text-muted text-sm">
          {{ $t('footer.copyright', { year: new Date().getFullYear() }) }}
        </p>
      </template>

      <template #right>
        <LocaleSwitcher />
        <UColorModeButton
          color="neutral"
          variant="ghost"
        />
      </template>
    </UFooter>
  </div>
</template>
