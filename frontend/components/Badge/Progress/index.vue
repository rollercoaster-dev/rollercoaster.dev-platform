<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  progress: number
}

const props = defineProps<Props>()

const progressClass = computed(() => {
  if (props.progress >= 100) return 'progress-complete'
  if (props.progress >= 50) return 'progress-halfway'
  return 'progress-started'
})
</script>
<template>
    <div class="mb-6">
      <div class="flex justify-between mb-2 text-sm">
        <span>Progress</span>
        <span>{{ progress }}%</span>
      </div>
      <div class="h-2 rounded overflow-hidden progress-bar">
        <div 
          class="h-full rounded transition-width duration-300 ease-in-out" 
          :style="{ width: `${progress}%` }"
          :class="progressClass"
        ></div>
      </div>
    </div>
  </template>

<style scoped>
.progress-bar {
  background-color: var(--vscode-bg-lighter);
}

.progress-started {
  background-color: var(--vscode-progress-blue);
}

.progress-halfway {
  background-color: var(--vscode-progress-yellow);
}

.progress-complete {
  background-color: var(--vscode-success);
}

/* Light theme overrides */
:deep(.light-theme) .progress-bar {
  background-color: var(--vscode-bg-lighter);
}
</style> 