<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <h1 class="text-3xl font-bold text-blue-600 mb-4">
      Hello Nuxt + Tailwind + shadcn!
    </h1>
    <Button>Click me</Button>
  </div>
</template>

<script setup>
import { Button } from '@/components/ui/button'
</script>

<style>
@import '~/assets/css/tailwind.css';
</style>
