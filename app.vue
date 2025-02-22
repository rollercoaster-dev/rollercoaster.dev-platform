<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <h1 class="text-3xl font-bold text-blue-600 mb-4">
      Hello Nuxt + Tailwind + shadcn!
    </h1>
    <div class="space-y-4">
      <div class="flex items-center gap-4">
        <Button @click="decrement">-</Button>
        <span class="text-2xl">{{ count }}</span>
        <Button @click="increment">+</Button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Auto-imported: no need to import ref, Button
const { count, increment, decrement } = useCounter()
</script>

<style>
@import '~/assets/css/tailwind.css';
</style>
