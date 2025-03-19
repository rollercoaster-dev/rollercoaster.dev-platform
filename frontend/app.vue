<script setup lang="ts">
import { TooltipProvider } from '@/components/ui/tooltip'
import AppLayout from '@/components/layout/AppLayout.vue'
</script>

<template>
  <TooltipProvider>
    <AppLayout>
      <NuxtPage />
    </AppLayout>
  </TooltipProvider>
</template>

<style>
@import '~/assets/css/tailwind.css';
</style>