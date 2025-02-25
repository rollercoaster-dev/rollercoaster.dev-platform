<script setup lang="ts">
import { Tooltip } from '@/components/ui/tooltip'

interface Props {
  text: string
  shortcut?: string
}

defineProps<Props>()
</script>

<template>
  <Tooltip :content="shortcut ? `${text}\nShortcut: ${shortcut}` : text">
    <slot />
  </Tooltip>
</template> 