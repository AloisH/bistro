<template>
  <div>
    <!-- Hero Section -->
    <UPageHero
      headline="100% Free & Open Source"
      title="The simplest way to manage your tasks"
      description="Bistro is a free, open-source todo app that helps you stay organized. No bloat, no complexity - just a clean interface to get things done."
      :links="[
        {
          label: 'Start for free',
          to: '/auth/register',
          trailingIcon: 'i-lucide-arrow-right',
          size: 'xl',
        },
        {
          label: 'View on GitHub',
          to: 'https://github.com/AloisH/bistro',
          target: '_blank',
          icon: 'i-simple-icons-github',
          size: 'xl',
          color: 'neutral',
          variant: 'subtle',
        },
      ]"
      :ui="{
        title:
          'animate-gradient-text bg-gradient-to-r from-primary-500 via-green-400 to-primary-600 bg-clip-text text-transparent',
      }"
    />

    <!-- Tech Stack Logos Section -->
    <UPageSection
      ref="techSection"
      class="scroll-animate"
    >
      <div class="text-center">
        <p class="text-muted mb-6 text-sm">Built with modern technologies</p>
        <div class="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          <NuxtLink
            v-for="(tech, index) in techStack"
            :key="tech.name"
            :to="tech.url"
            target="_blank"
            class="group flex flex-col items-center gap-2 transition-all duration-300 hover:scale-110"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <UIcon
              :name="tech.icon"
              class="group-hover:text-primary size-8 text-neutral-400 transition-colors duration-300 md:size-10 dark:text-neutral-500"
            />
            <span
              class="text-muted group-hover:text-foreground text-xs transition-colors duration-300"
            >
              {{ tech.name }}
            </span>
          </NuxtLink>
        </div>
      </div>
    </UPageSection>

    <!-- Features Section -->
    <UPageSection
      id="features"
      ref="featuresSection"
      title="Everything you need, nothing you don't"
      description="Focus on what matters. Bistro keeps task management simple while providing the essentials for personal productivity."
      :features="features"
      class="scroll-animate"
    />

    <!-- Testimonials Section -->
    <UPageSection
      ref="testimonialsSection"
      title="Loved by developers"
      description="See what others are saying about Bistro."
      class="scroll-animate"
    >
      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <UCard
          v-for="(testimonial, index) in testimonials"
          :key="testimonial.name"
          class="card-hover flex flex-col"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <div class="flex-1">
            <UIcon
              name="i-lucide-quote"
              class="text-primary mb-3 size-6"
            />
            <p class="text-muted">
              {{ testimonial.quote }}
            </p>
          </div>
          <div class="border-default mt-4 flex items-center gap-3 border-t pt-4">
            <UAvatar
              :text="
                testimonial.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
              "
              size="md"
            />
            <div>
              <p class="text-sm font-medium">
                {{ testimonial.name }}
              </p>
              <p class="text-muted text-xs">
                {{ testimonial.role }}
              </p>
            </div>
          </div>
        </UCard>
      </div>
    </UPageSection>

    <!-- Pricing Section -->
    <UPageSection
      id="pricing"
      ref="pricingSection"
      title="Simple pricing"
      description="Start free, scale as you grow. No hidden fees."
      class="scroll-animate"
    >
      <!-- Billing Toggle -->
      <div class="mb-8 flex justify-center">
        <UTabs
          v-model="billingPeriod"
          :items="billingOptions"
          size="lg"
        />
      </div>

      <!-- Pricing Plans -->
      <div class="flex justify-center">
        <UPricingPlans
          :plans="currentPlans"
          compact
          class="max-w-sm"
        />
      </div>
    </UPageSection>

    <!-- FAQ Section -->
    <UPageSection
      id="faq"
      ref="faqSection"
      title="Frequently asked questions"
      description="Got questions? We've got answers."
      class="scroll-animate"
    >
      <UAccordion
        :items="faqItems"
        class="mx-auto max-w-2xl"
      />
    </UPageSection>

    <!-- Early Access / Newsletter Section -->
    <UPageSection
      id="early-access"
      ref="ctaSection"
      class="scroll-animate"
    >
      <UPageCTA
        title="Get early access to new features"
        description="Join our newsletter to be the first to know about updates, new features, and tips to boost your productivity."
        variant="subtle"
      >
        <template #links>
          <form
            class="flex w-full max-w-md flex-col gap-3 sm:flex-row"
            @submit.prevent="handleSubscribe"
          >
            <UInput
              v-model="email"
              type="email"
              placeholder="Enter your email"
              size="lg"
              class="flex-1"
              required
            />
            <UButton
              type="submit"
              size="lg"
              :loading="subscribing"
            >
              Subscribe
            </UButton>
          </form>
        </template>
      </UPageCTA>
    </UPageSection>
  </div>
</template>

<script setup lang="ts">
const toast = useToast();
const config = useRuntimeConfig();
const siteUrl = config.public.appUrl || 'http://localhost:3000';

// SoftwareApplication JSON-LD schema
const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  'name': 'Bistro',
  'description':
    'Free, open-source todo app built with Nuxt 4. Simple task management with team collaboration.',
  'url': siteUrl,
  'applicationCategory': 'ProductivityApplication',
  'operatingSystem': 'Web',
  'offers': {
    '@type': 'Offer',
    'price': '0',
    'priceCurrency': 'USD',
  },
  'author': {
    '@type': 'Organization',
    'name': 'Bistro',
    'url': siteUrl,
  },
};

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(softwareSchema),
    },
  ],
});

// Refs for scroll animation
const techSection = ref<HTMLElement | null>(null);
const featuresSection = ref<HTMLElement | null>(null);
const testimonialsSection = ref<HTMLElement | null>(null);
const pricingSection = ref<HTMLElement | null>(null);
const faqSection = ref<HTMLElement | null>(null);
const ctaSection = ref<HTMLElement | null>(null);

// Set up scroll animations
const { observe } = useScrollAnimation();

onMounted(() => {
  [
    techSection,
    featuresSection,
    testimonialsSection,
    pricingSection,
    faqSection,
    ctaSection,
  ].forEach(section => observe(section));
});

// Tech stack logos
const techStack = [
  { name: 'Nuxt', icon: 'i-simple-icons-nuxtdotjs', url: 'https://nuxt.com' },
  { name: 'Vue', icon: 'i-simple-icons-vuedotjs', url: 'https://vuejs.org' },
  { name: 'Tailwind', icon: 'i-simple-icons-tailwindcss', url: 'https://tailwindcss.com' },
  { name: 'Prisma', icon: 'i-simple-icons-prisma', url: 'https://prisma.io' },
  { name: 'PostgreSQL', icon: 'i-simple-icons-postgresql', url: 'https://postgresql.org' },
  { name: 'TypeScript', icon: 'i-simple-icons-typescript', url: 'https://typescriptlang.org' },
];

// Features data
const features = [
  {
    icon: 'i-lucide-list-checks',
    title: 'Simple task management',
    description:
      'Create, organize, and complete tasks with an intuitive interface. No learning curve required.',
  },
  {
    icon: 'i-lucide-filter',
    title: 'Smart filtering',
    description: 'Filter tasks by status, sort by date or priority. Find what you need instantly.',
  },
  {
    icon: 'i-lucide-users',
    title: 'Team collaboration',
    description: 'Create organizations, invite team members, and manage tasks together.',
  },
  {
    icon: 'i-lucide-moon',
    title: 'Dark mode',
    description:
      'Easy on the eyes with automatic dark mode support. Work comfortably day or night.',
  },
  {
    icon: 'i-lucide-smartphone',
    title: 'Works everywhere',
    description: 'Fully responsive design that works beautifully on desktop, tablet, and mobile.',
  },
  {
    icon: 'i-lucide-lock',
    title: 'Secure by default',
    description: 'Your data is yours. Self-host it or trust our secure infrastructure.',
  },
];

// Testimonials
const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Indie Developer',
    quote:
      'Finally, a todo app that doesn\'t try to do everything. Bistro is simple, fast, and just works. Perfect for my daily workflow.',
  },
  {
    name: 'Marcus Johnson',
    role: 'Startup Founder',
    quote:
      'We switched our team to Bistro and productivity went up. The organization features are exactly what we needed without the bloat.',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Open Source Contributor',
    quote:
      'Love that it\'s open source! I can self-host it, customize it, and trust that my data stays mine. The codebase is clean too.',
  },
];

// Billing toggle
const billingPeriod = ref('monthly');
const billingOptions = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly', badge: 'Save 20%' },
];

// Pricing plans
const plans = {
  free: {
    title: 'Free',
    description: 'Everything you need to stay productive',
    tagline: 'Forever free',
    features: [
      'Unlimited tasks',
      'Unlimited organizations',
      'Team collaboration',
      'Dark mode',
      'Mobile responsive',
      'Open source',
    ],
    button: {
      label: 'Get started',
      to: '/auth/register',
    },
    highlight: true,
    monthly: { price: '$0', discount: '' },
    yearly: { price: '$0', discount: '' },
  },
  // Future: Pro tier
  // pro: {
  //   title: 'Pro',
  //   description: 'For power users and small teams',
  //   tagline: '/month',
  //   features: [
  //     'Everything in Free',
  //     'Priority support',
  //     'Advanced analytics',
  //     'API access',
  //     'Custom integrations',
  //   ],
  //   button: { label: 'Start trial', to: '/auth/register?plan=pro' },
  //   highlight: false,
  //   monthly: { price: '$12', discount: '' },
  //   yearly: { price: '$10', discount: '$12' },
  // },
};

const currentPlans = computed(() => {
  const period = billingPeriod.value as 'monthly' | 'yearly';
  return Object.values(plans).map(plan => ({
    title: plan.title,
    description: plan.description,
    tagline: plan.tagline,
    price: plan[period].price,
    discount: plan[period].discount,
    features: plan.features,
    button: plan.button,
    highlight: plan.highlight,
  }));
});

// FAQ items
const faqItems = [
  {
    label: 'Is Bistro really free?',
    content:
      'Yes! Bistro is 100% free and open source. There are no premium tiers, no hidden fees, and no credit card required. You can use all features without any limitations.',
  },
  {
    label: 'Can I self-host Bistro?',
    content:
      'Absolutely. Bistro is open source and designed to be self-hosted. Check out our GitHub repository for deployment instructions using Docker or your preferred hosting platform.',
  },
  {
    label: 'How do organizations work?',
    content:
      'Organizations allow you to collaborate with others. Create an organization, invite team members via email, and assign roles (Owner, Admin, Member, Guest) to control access levels.',
  },
  {
    label: 'Is my data secure?',
    content:
      'Security is a priority. We use industry-standard encryption, secure authentication, and never share your data with third parties. For maximum control, you can always self-host.',
  },
  {
    label: 'What tech stack does Bistro use?',
    content:
      'Bistro is built with Nuxt 4, Vue 3, Tailwind CSS, Prisma, and PostgreSQL. It uses Better Auth for authentication and Nuxt UI for the component library.',
  },
];

// Newsletter subscription
const email = ref('');
const subscribing = ref(false);

async function handleSubscribe() {
  if (!email.value) return;

  subscribing.value = true;
  try {
    // TODO: Implement actual subscription API
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.add({
      title: 'Subscribed!',
      description: 'Thanks for subscribing. We\'ll keep you posted.',
      color: 'success',
      icon: 'i-lucide-check',
    });
    email.value = '';
  } catch {
    toast.add({
      title: 'Error',
      description: 'Something went wrong. Please try again.',
      color: 'error',
      icon: 'i-lucide-alert-triangle',
    });
  } finally {
    subscribing.value = false;
  }
}
</script>
