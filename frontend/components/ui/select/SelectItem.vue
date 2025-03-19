<script setup lang="ts">
import { cn } from '@/lib/utils';
import { Check } from 'lucide-vue-next';

interface Props {
  class?: string;
  value: string;
  selected?: boolean;
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'select', value: string): void
}>()

const handleSelect = () => {
  emit('select', props.value)
}
</script>

<template>
  <div 
    role="option"
    :aria-selected="selected"
    :data-value="value"
    :class="cn(
      'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
      selected ? 'bg-accent text-accent-foreground' : '',
      props.class
    )"
    @click="handleSelect"
  >
    <span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <Check v-if="selected" class="h-4 w-4" />
    </span>
    <slot />
  </div>
</template>