<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Toast } from '@/components/ui/toast'
import { useToast } from '@/composables/useToast'

const { toasts, dismiss } = useToast()
</script>

<template>
  <div 
    class="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]"
  >
    <Toast
      v-for="toast in toasts"
      :key="toast.id"
      :title="toast.title"
      :description="toast.description"
      :variant="toast.variant"
      :open="true"
      @close="dismiss(toast.id)"
      class="pointer-events-auto"
    />
  </div>
</template>