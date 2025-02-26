<script setup lang="ts">
const loadOptions = ['low', 'medium', 'high'] as const
type LoadOption = typeof loadOptions[number]

const selectedLoad = ref<LoadOption>('low')
</script>

<template>
  <div class="min-h-screen transition-all duration-500">
    <div class="container mx-auto px-8 py-16 space-y-16">
      <!-- Header -->
      <section class="max-w-2xl mx-auto text-center space-y-4">
        <h1 class="text-4xl font-bold">Features</h1>
        <p class="text-lg text-muted-foreground">
          Discover how Rollercoaster.dev adapts to your needs and helps you stay on track.
        </p>
      </section>

      <!-- Feature Blocks -->
      <section class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Cognitive Load Demo -->
        <div class="space-y-4">
          <h2 class="text-2xl font-bold">Cognitive Load Indicators</h2>
          <p class="text-muted-foreground">
            Indicate the cognitive complexity of tasks to help manage your mental energy.
          </p>
          <div class="flex gap-4">
            <Button
              v-for="load in loadOptions"
              :key="load"
              @click="selectedLoad = load"
              :variant="selectedLoad === load ? 'default' : 'outline'"
              :class="[
                'load-indicator',
                `load-indicator-${load}`,
                selectedLoad === load ? 'scale-105 shadow-md' : ''
              ]"
            >
              {{ load.charAt(0).toUpperCase() + load.slice(1) }}
            </Button>
          </div>
        </div>

        <!-- Focus Mode Demo -->
        <div class="space-y-4">
          <h2 class="text-2xl font-bold">Focus Mode</h2>
          <p class="text-muted-foreground">
            Toggle focus mode to reduce visual noise and help you concentrate.
            Try combining it with dark mode to find your perfect environment.
          </p>
          <div class="p-6 rounded-lg bg-card">
            <p class="text-card-foreground">
              Focus mode reduces distractions by:
            </p>
            <ul class="list-disc list-inside mt-2 text-muted-foreground">
              <li>Minimizing visual noise</li>
              <li>Enhancing contrast</li>
              <li>Simplifying the interface</li>
              <li>Maintaining essential functionality</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Status Indicators -->
      <section class="space-y-4">
        <h2 class="text-2xl font-bold">Task Status Indicators</h2>
        <p class="text-muted-foreground">
          Clear visual indicators help you track task progress at a glance.
        </p>
        <div class="flex gap-4">
          <Button variant="outline" class="bg-status-blocked text-status-blocked-foreground">
            Blocked
          </Button>
          <Button variant="outline" class="bg-status-inprogress text-status-inprogress-foreground">
            In Progress
          </Button>
          <Button variant="outline" class="bg-status-complete text-status-complete-foreground">
            Complete
          </Button>
        </div>
      </section>
    </div>
  </div>
</template> 