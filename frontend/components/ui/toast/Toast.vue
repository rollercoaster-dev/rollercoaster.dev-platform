<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'
import { X } from 'lucide-vue-next'

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full',
  {
    variants: {
      variant: {
        default: 'border bg-background text-foreground',
        destructive:
          'destructive group border-destructive bg-destructive text-destructive-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface ToastProps {
  class?: string
  variant?: 'default' | 'destructive'
  open?: boolean
  title?: string
  description?: string
}

const props = withDefaults(defineProps<ToastProps>(), {
  variant: 'default',
  open: false,
})

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'close'): void
}>()

const isOpen = computed({
  get: () => props.open,
  set: (value) => {
    emit('update:open', value)
    if (!value) {
      emit('close')
    }
  },
})

const handleClose = () => {
  isOpen.value = false
}
</script>

<template>
  <div
    v-if="isOpen"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
    :class="cn(toastVariants({ variant }), class)"
    :data-state="isOpen ? 'open' : 'closed'"
  >
    <div class="grid gap-1">
      <div v-if="title" class="text-sm font-semibold">{{ title }}</div>
      <div v-if="description" class="text-sm opacity-90">{{ description }}</div>
    </div>
    <button
      type="button"
      class="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
      @click="handleClose"
    >
      <X class="h-4 w-4" />
      <span class="sr-only">Close</span>
    </button>
  </div>
</template>