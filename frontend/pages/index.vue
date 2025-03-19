<script setup>
// Redirect to dashboard
onMounted(() => {
  navigateTo('/dashboard')
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <p class="text-xl">Redirecting to dashboard...</p>
    </div>
  </div>
</template>