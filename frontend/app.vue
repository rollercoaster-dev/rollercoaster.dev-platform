<script setup lang="ts">
import { TooltipProvider } from '@/components/ui/tooltip'

console.log('TooltipProvider loaded:', TooltipProvider)
console.log('App.vue is being loaded')
</script>

<template>
  <TooltipProvider>
    <div class="min-h-screen bg-background text-foreground">
      <LayoutHeader />
      <NuxtPage />
    </div>
  </TooltipProvider>
</template>

<style>
@import '~/assets/css/tailwind.css';
</style>
