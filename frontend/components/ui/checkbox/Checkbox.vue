<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { CheckIcon } from 'lucide-vue-next'

interface Props {
  modelValue?: boolean
  id?: string
  name?: string
  value?: string
  required?: boolean
  disabled?: boolean
  class?: string
  checkClass?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'change', value: boolean): void
}>()

// Compute the checked state
const checked = computed({
  get: () => !!props.modelValue,
  set: (val: boolean) => {
    emit('update:modelValue', val)
    emit('change', val)
  },
})
</script>

<template>
  <div class="flex items-center space-x-2">
    <button
      type="button"
      role="checkbox"
      :id="id"
      :aria-checked="checked"
      :data-state="checked ? 'checked' : 'unchecked'"
      :disabled="disabled"
      :aria-disabled="disabled"
      :class="
        cn(
          'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
          class
        )
      "
      @click="checked = !checked"
    >
      <CheckIcon
        v-if="checked"
        :class="
          cn(
            'h-3 w-3 text-current',
            checkClass
          )
        "
      />
    </button>
    <slot />
  </div>
</template>