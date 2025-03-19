<script setup lang="ts">
import { cn } from '@/lib/utils';

interface Props {
  class?: string;
}

const props = defineProps<Props>()
</script>

<template>
  <div 
    :class="cn(
      'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover shadow-md',
      props.class
    )"
  >
    <div class="p-1">
      <slot />
    </div>
  </div>
</template>