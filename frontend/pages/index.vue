<template>
  <div class="min-h-screen transition-all duration-500">
    <div class="container mx-auto px-8 py-16">
      <!-- Hero Section -->
      <section class="max-w-4xl mx-auto space-y-8 text-center">
        <h1 class="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
          Welcome to Rollercoaster.dev
        </h1>
        
        <!-- Main pitch -->
        <p class="text-xl text-foreground/90 leading-relaxed">
          Your personalized tool for creating a learning journey that's uniquely yours. Here, you set your own goals and upskill at your own pace. Our platform helps you track progress with intuitive tools—like digital badges that serve as a record of your achievements—so you can see how far you've come without losing sight of what truly matters.
        </p>

        <!-- Support message -->
        <div class="bg-card rounded-lg p-8 shadow-sm">
          <p class="text-lg text-card-foreground leading-relaxed">
            Through the ups and downs, we'll help keep your learning and goals on track. Whether you're picking up where you left off after a break or adjusting your path to meet new challenges, our supportive environment ensures that your progress remains steady and your aspirations remain clear.
          </p>
        </div>

        <!-- Community call -->
        <div class="space-y-6">
          <p class="text-lg text-muted-foreground leading-relaxed">
            Join a community of like-minded individuals committed to growth, resilience, and continuous improvement. Take control of your future with Rollercoaster.dev—where your learning journey is always evolving, and every step is a step forward.
          </p>
          
          <div class="flex justify-center gap-4">
            <Button size="lg" class="rounded-full">
              Start Your Journey
            </Button>
            <NuxtLink to="/features">
              <Button size="lg" variant="outline" class="rounded-full">
                Learn More
              </Button>
            </NuxtLink>
          </div>
        </div>
      </section>
    </div>
  </div>
</template> 