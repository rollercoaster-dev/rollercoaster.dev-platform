<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  value?: number
  max?: number
  class?: string
  indicatorClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  max: 100,
})

const emit = defineEmits<{
  (e: 'update:value', value: number): void
}>()

// Set up references for the progress element
const progressEl = ref<HTMLDivElement | null>(null)
const indicatorEl = ref<HTMLDivElement | null>(null)
const displayValue = ref(0)

// Calculate the percentage of the progress
const percentage = computed(() => {
  const value = props.value || 0
  const max = props.max || 100
  return Math.min(Math.max(0, value), max) / max
})

// When the component is mounted, update the progress display
onMounted(() => {
  if (props.value !== undefined) {
    // Animate the progress indicator
    displayValue.value = props.value
    
    // Update the indicator width for accessibility
    if (indicatorEl.value) {
      indicatorEl.value.style.transform = `translateX(-${100 - percentage.value * 100}%)`
    }
  }
})

// When value changes, update the display
const value = computed({
  get: () => props.value || 0,
  set: (val) => {
    emit('update:value', val)
    displayValue.value = val
    
    if (indicatorEl.value) {
      indicatorEl.value.style.transform = `translateX(-${100 - percentage.value * 100}%)`
    }
  }
})
</script>

<template>
  <div
    ref="progressEl"
    role="progressbar"
    :aria-valuemin="0"
    :aria-valuemax="max"
    :aria-valuenow="value"
    aria-label="Progress"
    :class="cn('relative h-4 w-full overflow-hidden rounded-full bg-secondary', class)"
  >
    <div
      ref="indicatorEl"
      :class="cn('h-full w-full flex-1 bg-primary transition-all', indicatorClass)"
      :style="{ transform: `translateX(-${100 - percentage * 100}%)` }"
    />
  </div>
</template>