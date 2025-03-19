<script setup lang="ts">
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-vue-next';

interface Props {
  class?: string;
  placeholder?: string;
}

const props = defineProps<Props>()
</script>

<template>
  <button 
    type="button"
    :class="cn(
      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      props.class
    )"
  >
    <slot>
      <span class="text-muted-foreground">{{ placeholder }}</span>
    </slot>
    <ChevronDown class="h-4 w-4 opacity-50" />
  </button>
</template>