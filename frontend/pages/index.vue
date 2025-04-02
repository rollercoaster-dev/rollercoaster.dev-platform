<template>
  <div class="min-h-screen bg-background text-foreground font-sans">
    <main class="container mx-auto max-w-4xl px-4 py-12 space-y-12">
      <!-- 1. Headline / Hero Section -->
      <section class="text-center space-y-4">
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
          <!-- Using simplified span for now -->
          <span class="text-primary font-bold">
            Rollercoaster.dev
          </span>
           is a space where neurodivergent minds create and discover tools designed for the way we think.
        </h1>
      </section>

      <!-- 2. "What We're Building" Section -->
      <section class="space-y-4 rounded-lg bg-card p-6 border border-border">
        <h2 class="text-2xl font-semibold tracking-tight text-primary">What We're Building</h2>
        <p class="text-lg text-card-foreground/90">
          At Rollercoaster.dev, we're crafting a unique platform centered around 
          <a href="https://openbadges.org" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline font-semibold">Open Badges</a>, 
          designed specifically for the neurodivergent experience.
        </p>
        <p class="text-card-foreground/80">
          Imagine a place where you can:
        </p>
        <ul class="list-disc list-inside space-y-2 text-card-foreground/80">
          <li>
            <strong>Track and showcase progress</strong> on *any* goal that matters to you – learning, work, hobbies, community action, personal growth, and more.
          </li>
          <li>
            <strong>Visualize your journey</strong> and achievements in meaningful ways.
          </li>
          <li>
            <strong>Easily pause and restart</strong> your activities, with support to pick things back up, especially during challenging times like burnout or low motivation.
          </li>
          <li>
            <strong>Connect with a community</strong> for validation, shared learning, and mutual support.
          </li>
        </ul>
        <p class="text-card-foreground/90">
          We believe this system can empower neurodivergent individuals to navigate their goals, document their unique paths, and build confidence along the way.
        </p>
      </section>

      <!-- 3. "Our Vision & Goals" Section -->
      <section class="space-y-4">
        <h2 class="text-2xl font-semibold tracking-tight text-primary">Our Vision: Tools Built From Lived Experience</h2>
        <p class="text-foreground/90">
          Standard productivity tools often fall short for neurodivergent individuals. Rigid schedules and linear lists don't always align with how our minds work best. We understand that neurodivergent strengths are different, and navigating goals requires tools that offer flexibility, clear steps, and genuine understanding – not just another calendar.
        </p>
        <p class="text-foreground/90">
          At Rollercoaster.dev, our vision is simple: 
          <strong class="text-accent">Create the tools we wish existed, built *by* and *for* the neurodivergent community.</strong>
        </p>
        <p class="text-foreground/80">
          Our goals are:
        </p>
        <ul class="list-disc list-inside space-y-2 text-foreground/80">
          <li>
            <strong>To empower users</strong> by breaking down overwhelming goals into manageable, actionable steps.
          </li>
          <li>
            <strong>To offer flexibility</strong>, allowing individuals to pursue their objectives in a way that adapts to their fluctuating energy and focus, free from rigid timelines.
          </li>
          <li>
            <strong>To foster a community</strong> built on shared understanding and mutual support, where connecting with others who navigate similar challenges helps everyone grow – because we know the power of shared stories and truly 'getting it'.
          </li>
        </ul>
        <p class="text-foreground/90">
          We're building this because we understand the need firsthand. It's about creating solutions that embrace and support the diverse ways neurodivergent minds thrive.
        </p>
      </section>

      <!-- 4. "Rough Roadmap" Section -->
      <section class="space-y-4 rounded-lg bg-card p-6 border border-border">
        <h2 class="text-2xl font-semibold tracking-tight text-primary">Where We Are & Where We're Going</h2>
        <p class="text-card-foreground/90">
          Our journey is underway! Here's a glimpse of our progress and planned next steps:
        </p>
        <ol class="list-decimal list-inside space-y-3 text-card-foreground/80">
          <li>
            <strong>Core Engine (Near Completion - Alpha):</strong> We're finalizing the backend API (`bun-badges`) and shared data structures (`openbadges-types`) based on the Open Badges standard. These form the foundation of the platform.
            <br/>
            <em class="text-sm">See progress: 
              <a href="https://github.com/rollercoaster-dev/bun-badges" target="_blank" rel="noopener noreferrer" class="text-accent hover:brightness-110 underline">bun-badges</a>, 
              <a href="https://github.com/rollercoaster-dev/openbadges-types" target="_blank" rel="noopener noreferrer" class="text-accent hover:brightness-110 underline">openbadges-types</a>
            </em>
          </li>
          <li>
            <strong>Building Blocks (Next Up):</strong> Development will begin on a library of reusable interface components (Vue) specifically for interacting with Open Badges.
          </li>
          <li>
            <strong>The Platform (Planned):</strong> Bringing it all together into an intuitive workspace (`badges.rollercoaster.dev`) where users can manage, visualize, and share their badges and learning journeys.
          </li>
          <li>
            <strong>Community & Growth (Ongoing/Future):</strong> We're actively seeking neurodivergent collaborators to join the development and design effort. Following the initial build, we'll focus on securing funding and initiating testing phases.
          </li>
        </ol>
        <p class="text-card-foreground/90">
          We're excited about building this incrementally and transparently with the community.
        </p>
      </section>

      <!-- 5. "Get Involved / Stay Updated" Section -->
      <section class="space-y-6 text-center">
        <h2 class="text-2xl font-semibold tracking-tight text-primary">Join Our Journey</h2>
        <p class="text-foreground/90">
          Rollercoaster.dev is being built *by* neurodivergent individuals, *for* neurodivergent individuals. 
          We believe in the power of lived experience to create tools that truly resonate.
        </p>
        
        <div class="grid md:grid-cols-2 gap-6">
          <!-- Users -->
          <div class="space-y-3 rounded-lg bg-card p-6 border border-border">
            <h3 class="text-xl font-medium text-card-foreground">Interested in Using the Tools?</h3>
            <p class="text-card-foreground/80">Want to know when the platform launches or major updates are released?</p>
            <a 
              href="https://github.com/rollercoaster-dev"
              target="_blank" 
              rel="noopener noreferrer" 
              class="inline-block px-6 py-2 rounded-md bg-accent text-accent-foreground font-medium hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors"
            >
              Follow Progress on GitHub
            </a>
          </div>

          <!-- Contributors -->
          <div class="space-y-3 rounded-lg bg-card p-6 border border-border">
            <h3 class="text-xl font-medium text-card-foreground">Interested in Contributing?</h3>
            <p class="text-card-foreground/80">We're seeking passionate neurodivergent creators (designers, frontend, backend, full-stack). Explore our work or get in touch!</p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="https://github.com/rollercoaster-dev"
                target="_blank" 
                rel="noopener noreferrer" 
                class="inline-block px-6 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors"
              >
                Explore on GitHub
              </a>
               <a 
                href="mailto:dev@rollercoaster.dev"
                class="inline-block px-6 py-2 rounded-md border border-primary text-primary font-medium hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-colors"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
// No script logic needed for this static page yet.
// DefinePageMeta might be used later for SEO.
</script>

<style scoped>
/* Scoped styles if needed */
</style> 