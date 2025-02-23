<script setup lang="ts">
const cognitiveLoad = ref('low')
const focusMode = ref(false)

const toggleFocusMode = () => {
  focusMode.value = !focusMode.value
}

const setCognitiveLoad = (load: 'low' | 'medium' | 'high') => {
  cognitiveLoad.value = load
}
</script>

<template>
  <div :class="[
    'min-h-screen transition-colors duration-300',
    focusMode ? 'focus-mode' : 'bg-background'
  ]">
    <!-- Header -->
    <header class="container py-8">
      <div class="flex items-center justify-between">
        <h1 class="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          rollercoaster.dev
        </h1>
        <div class="flex items-center gap-4">
          <Button @click="toggleFocusMode" :variant="focusMode ? 'secondary' : 'outline'">
            {{ focusMode ? 'Exit Focus' : 'Focus Mode' }}
          </Button>
        </div>
      </div>
      <p class="mt-2 text-xl text-muted-foreground">Neurospicy Software Solutions</p>
    </header>

    <!-- Main Content -->
    <main class="container py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Color System Demo -->
        <Card class="p-6">
          <CardHeader>
            <CardTitle>Color System Demo</CardTitle>
            <CardDescription>Explore our ADHD-friendly color system</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <!-- Primary Colors -->
            <div class="space-y-2">
              <h3 class="text-sm font-medium">Primary Actions</h3>
              <div class="flex gap-2">
                <Button variant="default">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="accent">Accent</Button>
              </div>
            </div>

            <!-- Cognitive Load Indicators -->
            <div class="space-y-2">
              <h3 class="text-sm font-medium">Cognitive Load</h3>
              <div class="flex gap-2">
                <div 
                  v-for="load in ['low', 'medium', 'high']" 
                  :key="load"
                  :class="[
                    'p-4 rounded-md cursor-pointer transition-colors',
                    `bg-load-${load}`,
                    cognitiveLoad === load ? 'ring-2 ring-primary' : ''
                  ]"
                  @click="setCognitiveLoad(load)"
                >
                  {{ load }}
                </div>
              </div>
            </div>

            <!-- Status Indicators -->
            <div class="space-y-2">
              <h3 class="text-sm font-medium">Status Indicators</h3>
              <div class="flex gap-2">
                <Alert variant="default" class="w-full">
                  <AlertTitle>Information</AlertTitle>
                  <AlertDescription>This is an info message.</AlertDescription>
                </Alert>
                <Alert variant="destructive" class="w-full">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>Something went wrong.</AlertDescription>
                </Alert>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Focus Mode Demo -->
        <Card class="p-6">
          <CardHeader>
            <CardTitle>Focus Mode</CardTitle>
            <CardDescription>Distraction-free environment for deep work</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <p class="text-muted-foreground">
                Focus mode provides a clean, distraction-free environment with:
              </p>
              <ul class="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Reduced visual noise</li>
                <li>Higher contrast text</li>
                <li>Minimal color palette</li>
                <li>Clear visual hierarchy</li>
              </ul>
              <Button @click="toggleFocusMode" class="w-full">
                {{ focusMode ? 'Exit Focus Mode' : 'Enter Focus Mode' }}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
</template> 