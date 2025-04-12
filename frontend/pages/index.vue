<script setup lang="ts">

import {
  UIBadge,
  UICard,
  UICardHeader,
  UICardTitle,
  UICardContent,
  UICardFooter,
} from '#components';

// Import our custom base components
import RDBaseSectionHeader from '~/components/rd/Base/SectionHeader.vue';

const config = useRuntimeConfig();
const siteName = config.public.siteName as string;

useSeoMeta({
  title: 'Rollercoaster.dev: Tools for Neurodivergent Minds',
  description:
    'Building flexible tools with Open Badges, designed by and for the neurodivergent community to navigate goals and showcase progress.',
  ogTitle: 'Rollercoaster.dev: Tools for Neurodivergent Minds',
  ogDescription:
    'Building flexible tools with Open Badges for the neurodivergent community.',
  ogSiteName: siteName,
  twitterCard: 'summary_large_image',
});
</script>

<template>
  <div class="min-h-screen bg-background text-foreground font-sans">
    <main class="container mx-auto max-w-4xl px-4 py-12 space-y-12">
      <!-- 1. Headline / Hero Section -->
      <section class="relative text-center space-y-8 py-8">
        <!-- Decorative background elements -->
        <div
          class="absolute inset-0 overflow-hidden pointer-events-none opacity-50"
        >
          <div
            class="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
          ></div>
          <div
            class="absolute -bottom-24 -right-24 w-64 h-64 bg-accent/5 rounded-full blur-3xl"
          ></div>
        </div>

        <h1
          class="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight max-w-3xl mx-auto"
        >
          <RDHeadlineGradient>Rollercoaster.dev</RDHeadlineGradient>
          <span
            class="mt-6 block text-2xl md:text-3xl font-medium text-foreground/90"
          >
            is a space where neurodivergent minds create and discover tools
            designed for the way we think.
          </span>
        </h1>

        <!-- Quick action buttons -->
        <div class="flex flex-wrap justify-center gap-4">
          <RDBaseLink
            href="#what-we-build"
            icon="arrow-down"
            internal
          >
          Learn More
          </RDBaseLink>
          <!-- Duplicate link removed -->
          <RDBaseLink
            href="https://github.com/rollercoaster-dev"
            variant="secondary"
          >
            View on GitHub
          </RDBaseLink>
        </div>
      </section>

      <UISeparator class="my-12" />

      <!-- 2. "What We're Building" Section -->
      <section id="what-we-build" class="space-y-8 scroll-mt-16">
        <RDBaseSectionHeader
          title="What We're Building"
          description="At Rollercoaster.dev, we're crafting a unique platform centered around"
        >
          <template #description>
            At Rollercoaster.dev, we're crafting a unique platform centered
            around
            <RDBaseLink
              href="https://openbadges.org"
              variant="text"
              icon="arrow-right"
              class="text-accent font-semibold"
            >
              Open Badges
            </RDBaseLink>
            , designed specifically for the neurodivergent experience.
          </template>
        </RDBaseSectionHeader>

        <div class="grid md:grid-cols-2 gap-6">
          <!-- Feature 1: Track Progress -->
          <UICard
            class="overflow-hidden hover:shadow-lg transition-shadow group h-full flex flex-col"
          >
            <UICardHeader>
              <UICardTitle class="flex items-center gap-2 text-xl">
                <span class="text-2xl text-accent">📊</span>
                Track and Showcase Progress
              </UICardTitle>
            </UICardHeader>
            <UICardContent class="flex-1 flex flex-col">
              <p class="text-card-foreground/90">
                Track progress on any goal that matters to you – learning, work,
                hobbies, community action, personal growth, and more. Our
                flexible system adapts to your unique journey, letting you
                document and celebrate achievements in a way that makes sense
                for you.
              </p>
              <div class="mt-auto pt-4 border-t border-border/50">
                <span class="text-xs text-muted-foreground">Key Features:</span>
                <ul class="mt-2 space-y-1 text-sm">
                  <li class="flex items-center gap-2">
                    <span class="text-accent">✓</span>
                    Flexible goal tracking
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="text-accent">✓</span>
                    Custom achievement paths
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="text-accent">✓</span>
                    Progress visualization
                  </li>
                </ul>
              </div>
            </UICardContent>
          </UICard>

          <!-- Feature 2: Visualize Journey -->
          <UICard
            class="overflow-hidden hover:shadow-lg transition-shadow group h-full flex flex-col"
          >
            <UICardHeader>
              <UICardTitle class="flex items-center gap-2 text-xl">
                <span class="text-2xl text-accent">🎨</span>
                Visualize Your Journey
              </UICardTitle>
            </UICardHeader>
            <UICardContent class="flex-1 flex flex-col">
              <p class="text-card-foreground/90">
                See your progress and achievements in meaningful, visual ways.
                Our platform offers different views and representations of your
                journey, helping you recognize patterns, celebrate milestones,
                and stay motivated through visual feedback.
              </p>
              <div class="mt-auto pt-4 border-t border-border/50">
                <span class="text-xs text-muted-foreground">Key Features:</span>
                <ul class="mt-2 space-y-1 text-sm">
                  <li class="flex items-center gap-2">
                    <span class="text-accent">✓</span>
                    Multiple view options
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="text-accent">✓</span>
                    Pattern recognition
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="text-accent">✓</span>
                    Visual milestone tracking
                  </li>
                </ul>
              </div>
            </UICardContent>
          </UICard>

          <!-- Feature 3: Flexibility -->
          <UICard
            class="overflow-hidden hover:shadow-lg transition-shadow group h-full flex flex-col"
          >
            <UICardHeader>
              <UICardTitle class="flex items-center gap-2 text-xl">
                <span class="text-2xl text-accent">🌱</span>
                Pause and Restart with Ease
              </UICardTitle>
            </UICardHeader>
            <UICardContent class="flex-1 flex flex-col">
              <p class="text-card-foreground/90">
                Life isn't linear, and neither is progress. Our system supports
                natural ebbs and flows, letting you pause during challenging
                times like burnout or low motivation. When you're ready to
                return, you'll find your progress preserved and tools to help
                you pick up where you left off.
              </p>
              <div class="mt-auto pt-4 border-t border-border/50">
                <span class="text-xs text-muted-foreground">Key Features:</span>
                <ul class="mt-2 space-y-1 text-sm">
                  <li class="flex items-center gap-2">
                    <span class="text-accent">✓</span>
                    Flexible pausing
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="text-accent">✓</span>
                    Progress preservation
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="text-accent">✓</span>
                    Easy resumption
                  </li>
                </ul>
              </div>
            </UICardContent>
          </UICard>

          <!-- Feature 4: Community -->
          <UICard
            class="overflow-hidden hover:shadow-lg transition-shadow group h-full flex flex-col"
          >
            <UICardHeader>
              <UICardTitle class="flex items-center gap-2 text-xl">
                <span class="text-2xl text-accent">🤝</span>
                Connect with Community
              </UICardTitle>
            </UICardHeader>
            <UICardContent class="flex-1 flex flex-col">
              <p class="text-card-foreground/90">
                Join a community that understands. Share experiences, learn from
                others' journeys, and find mutual support. Our platform
                facilitates meaningful connections through shared achievements
                and collaborative learning paths.
              </p>
              <div class="mt-auto pt-4 border-t border-border/50">
                <span class="text-xs text-muted-foreground">Key Features:</span>
                <ul class="mt-2 space-y-1 text-sm">
                  <li class="flex items-center gap-2">
                    <span class="text-accent">✓</span>
                    Shared achievements
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="text-accent">✓</span>
                    Learning communities
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="text-accent">✓</span>
                    Mutual support
                  </li>
                </ul>
              </div>
            </UICardContent>
          </UICard>
        </div>

        <p
          class="text-lg text-card-foreground/90 text-center max-w-3xl mx-auto italic"
        >
          We believe this system can empower neurodivergent individuals to
          navigate their goals, document their unique paths, and build
          confidence along the way.
        </p>
      </section>

      <UISeparator class="my-12" />

      <!-- 3. "Our Vision & Goals" Section -->
      <section class="space-y-8">
        <RDBaseSectionHeader
          title="Our Vision: Tools Built From Lived Experience"
          description="Standard productivity tools often fall short for neurodivergent individuals."
        />

        <!-- Vision Cards -->
        <div class="grid md:grid-cols-2 gap-6">
          <UICard class="overflow-hidden">
            <UICardHeader>
              <UICardTitle class="text-xl font-medium text-primary"
                >The Challenge</UICardTitle
              >
            </UICardHeader>
            <UICardContent class="space-y-4">
              <p class="text-card-foreground/90">
                Rigid schedules and linear lists don't always align with how our
                minds work best. We understand that neurodivergent strengths are
                different, and navigating goals requires tools that offer
                flexibility, clear steps, and genuine understanding – not just
                another calendar.
              </p>
            </UICardContent>
          </UICard>

          <UICard
            class="overflow-hidden bg-gradient-to-br from-accent/10 to-transparent"
          >
            <UICardHeader>
              <UICardTitle class="text-xl font-medium text-primary"
                >Our Solution</UICardTitle
              >
            </UICardHeader>
            <UICardContent class="space-y-4">
              <p class="text-card-foreground/90">
                At Rollercoaster.dev, our vision is simple:
                <strong class="block mt-2 text-xl text-accent"
                  >Create the tools we wish existed, built <em>by</em> and
                  <em>for</em> the neurodivergent community.</strong
                >
              </p>
            </UICardContent>
          </UICard>
        </div>

        <!-- Goals Section -->
        <div class="mt-12 space-y-6">
          <h3 class="text-2xl font-medium text-primary text-center">
            Our Goals
          </h3>
          <div class="grid md:grid-cols-3 gap-6">
            <!-- Goal 1 -->
            <UICard class="overflow-hidden hover:shadow-lg transition-shadow">
              <UICardHeader>
                <UICardTitle class="flex items-center gap-2 text-lg">
                  <span class="text-2xl text-accent">🎯</span>
                  To Empower Users
                </UICardTitle>
              </UICardHeader>
              <UICardContent>
                <p class="text-card-foreground/90">
                  Breaking down overwhelming goals into manageable, actionable
                  steps that make sense for you.
                </p>
              </UICardContent>
            </UICard>

            <!-- Goal 2 -->
            <UICard class="overflow-hidden hover:shadow-lg transition-shadow">
              <UICardHeader>
                <UICardTitle class="flex items-center gap-2 text-lg">
                  <span class="text-2xl text-accent">🌊</span>
                  To Offer Flexibility
                </UICardTitle>
              </UICardHeader>
              <UICardContent>
                <p class="text-card-foreground/90">
                  Adapting to your fluctuating energy and focus, free from rigid
                  timelines and expectations.
                </p>
              </UICardContent>
            </UICard>

            <!-- Goal 3 -->
            <UICard class="overflow-hidden hover:shadow-lg transition-shadow">
              <UICardHeader>
                <UICardTitle class="flex items-center gap-2 text-lg">
                  <span class="text-2xl text-accent">🤝</span>
                  To Foster Community
                </UICardTitle>
              </UICardHeader>
              <UICardContent>
                <p class="text-card-foreground/90">
                  Building connections through shared understanding and mutual
                  support, because we truly 'get it'.
                </p>
              </UICardContent>
            </UICard>
          </div>
        </div>

        <p
          class="text-lg text-card-foreground/90 text-center max-w-3xl mx-auto mt-8"
        >
          We're building this because we understand the need firsthand. It's
          about creating solutions that embrace and support the diverse ways
          neurodivergent minds thrive.
        </p>
      </section>

      <UISeparator class="my-12" />

      <!-- 4. "Roadmap" Section -->
      <section class="space-y-8">
        <RDBaseSectionHeader
          title="Where We Are & Where We're Going"
          description="Our journey is underway! Here's a glimpse of our progress and planned next steps:"
        />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Item 1: Core Engine -->
          <UICard
            class="group overflow-hidden hover:shadow-lg transition-all relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:-z-10"
          >
            <UICardHeader>
              <UICardTitle class="flex items-center gap-2">
                <span
                  class="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold"
                  >1</span
                >
                <span class="text-xl">Core Engine</span>
                <UIBadge
                  variant="default"
                  class="ml-auto bg-primary/20 text-primary border-primary/30"
                  >Near Completion (Alpha)</UIBadge
                >
              </UICardTitle>
            </UICardHeader>
            <UICardContent class="space-y-4">
              <p class="text-card-foreground/90">
                We're finalizing the backend API (`bun-badges`) and shared data
                structures (`openbadges-types`) based on the Open Badges
                standard. These form the foundation of the platform.
              </p>
              <div class="flex items-center gap-4 text-sm">
                <span class="text-muted-foreground">See progress:</span>
                <div class="flex gap-2">
                  <RDBaseLink
                    href="https://github.com/rollercoaster-dev/bun-badges"
                    variant="text"
                    icon="arrow-right"
                    class="text-accent"
                  >
                    bun-badges
                  </RDBaseLink>
                  <RDBaseLink
                    href="https://github.com/rollercoaster-dev/openbadges-types"
                    variant="text"
                    icon="arrow-right"
                    class="text-accent"
                  >
                    openbadges-types
                  </RDBaseLink>
                </div>
              </div>
            </UICardContent>
          </UICard>

          <!-- Item 2: Building Blocks -->
          <UICard
            class="group overflow-hidden hover:shadow-lg transition-all relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-secondary/5 before:to-transparent before:-z-10"
          >
            <UICardHeader>
              <UICardTitle class="flex items-center gap-2">
                <span
                  class="flex items-center justify-center w-8 h-8 rounded-full bg-secondary/10 text-secondary font-semibold"
                  >2</span
                >
                <span class="text-xl">Building Blocks</span>
                <UIBadge variant="secondary" class="ml-auto">Next Up</UIBadge>
              </UICardTitle>
            </UICardHeader>
            <UICardContent class="space-y-4 flex flex-col h-full">
              <p class="text-card-foreground/90">
                Development will begin on a library of reusable interface
                components (Vue) specifically for interacting with Open Badges.
              </p>
              <div
                class="flex items-center gap-2 text-sm text-muted-foreground mt-auto pt-4"
              >
                <span>🔨</span>
                <span>Component library development starting soon</span>
              </div>
            </UICardContent>
          </UICard>

          <!-- Item 3: The Platform -->
          <UICard
            class="group overflow-hidden hover:shadow-lg transition-all relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-accent/5 before:to-transparent before:-z-10"
          >
            <UICardHeader>
              <UICardTitle class="flex items-center gap-2">
                <span
                  class="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent font-semibold"
                  >3</span
                >
                <span class="text-xl">The Platform</span>
                <UIBadge variant="outline" class="ml-auto">Planned</UIBadge>
              </UICardTitle>
            </UICardHeader>
            <UICardContent class="space-y-4">
              <p class="text-card-foreground/90">
                Bringing it all together into an intuitive workspace
                (`badges.rollercoaster.dev`) where users can manage, visualize,
                and share their badges and learning journeys.
              </p>
              <div
                class="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <span>🎯</span>
                <span>Platform development planned for Q2 2024</span>
              </div>
            </UICardContent>
          </UICard>

          <!-- Item 4: Community & Growth -->
          <UICard
            class="group overflow-hidden hover:shadow-lg transition-all relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:-z-10"
          >
            <UICardHeader>
              <UICardTitle class="flex items-center gap-2">
                <span
                  class="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold"
                  >4</span
                >
                <span class="text-xl">Community & Growth</span>
                <UIBadge variant="outline" class="ml-auto"
                  >Ongoing/Future</UIBadge
                >
              </UICardTitle>
            </UICardHeader>
            <UICardContent class="space-y-4">
              <p class="text-card-foreground/90">
                We're actively seeking neurodivergent collaborators to join the
                development and design effort. Following the initial build,
                we'll focus on securing funding and initiating testing phases.
              </p>
              <div
                class="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <span>🌱</span>
                <span>Join us in shaping the future!</span>
              </div>
            </UICardContent>
          </UICard>
        </div>

        <p
          class="text-lg text-card-foreground/90 text-center max-w-3xl mx-auto italic"
        >
          We're excited about building this incrementally and transparently with
          the community.
        </p>
      </section>

      <UISeparator class="my-12" />

      <!-- 5. "Get Involved" Section -->
      <section class="space-y-8">
        <RDBaseSectionHeader
          title="Join Our Journey"
        >
          <template #description>
            Rollercoaster.dev is being built <em>by</em> neurodivergent
            individuals, <em>for</em> neurodivergent individuals. We believe in
            the power of lived experience to create tools that truly resonate.
          </template>
        </RDBaseSectionHeader>

        <div class="grid md:grid-cols-2 gap-6">
          <!-- Users Card -->
          <UICard class="grid grid-rows-[auto_1fr_auto]">
            <UICardHeader>
              <UICardTitle class="text-xl"
                >👋 Interested in Using the Tools?</UICardTitle
              >
            </UICardHeader>
            <UICardContent>
              <p class="text-muted-foreground">
                Want to know when the platform launches or major updates are
                released?
              </p>
              <ul class="mt-4 space-y-2">
                <li class="flex items-center gap-2">
                  ✓ Get early access to features
                </li>
                <li class="flex items-center gap-2">
                  ✓ Stay updated on development
                </li>
                <li class="flex items-center gap-2">
                  ✓ Provide valuable feedback
                </li>
              </ul>
            </UICardContent>
            <UICardFooter class="flex justify-center">
              <RDBaseLink
                href="https://github.com/rollercoaster-dev"
                variant="primary"
                class="w-full justify-center bg-accent text-accent-foreground hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
              >
                Follow Progress on GitHub
              </RDBaseLink>
            </UICardFooter>
          </UICard>

          <!-- Contributors Card -->
          <UICard class="grid grid-rows-[auto_1fr_auto]">
            <UICardHeader>
              <UICardTitle class="text-xl"
                >🚀 Interested in Contributing?</UICardTitle
              >
            </UICardHeader>
            <UICardContent>
              <p class="text-muted-foreground">
                We're seeking passionate neurodivergent creators (designers,
                frontend, backend, full-stack). Explore our work or get in
                touch!
              </p>
              <ul class="mt-4 space-y-2">
                <li class="flex items-center gap-2">
                  ✓ Shape the platform's future
                </li>
                <li class="flex items-center gap-2">
                  ✓ Work with like-minded creators
                </li>
                <li class="flex items-center gap-2">
                  ✓ Build tools that matter
                </li>
              </ul>
            </UICardContent>
            <UICardFooter>
              <div class="w-full grid grid-cols-2 gap-4">
                <RDBaseLink
                  href="https://github.com/rollercoaster-dev"
                  variant="primary"
                  class="justify-center focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                >
                  Explore on GitHub
                </RDBaseLink>
                <RDBaseLink
                  href="mailto:dev@rollercoaster.dev"
                  variant="secondary"
                  internal
                  class="justify-center focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
                >
                  Email Us
                </RDBaseLink>
              </div>
            </UICardFooter>
          </UICard>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* Scoped styles if needed */
</style>
