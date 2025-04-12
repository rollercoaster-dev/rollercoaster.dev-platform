<script setup lang="ts">
// import { TooltipProvider } from '@/components/ui/tooltip';

// console.log('TooltipProvider loaded:', TooltipProvider);
console.log('App.vue is being loaded');
</script>

<template>
  <UITooltipProvider>
    <div class="min-h-screen bg-background text-foreground">
      <RDLayoutHeader />
      <NuxtPage />
    </div>
  </UITooltipProvider>
</template>

<style>
@import '~/assets/css/tailwind.css';
</style>
