<template>
  <div class="badge-list">
    <div class="badge-list-header">
      <h2>Badges</h2>
      <button 
        class="create-button" 
        @click="$emit('create')"
      >
        Create New Badge
      </button>
    </div>
    <div v-if="isLoading" class="loading">
      Loading badges...
    </div>
    <div v-else-if="error" class="error">
      {{ error }}
      <button @click="$emit('retry')">Retry</button>
    </div>
    <div v-else class="badge-items">
      <div 
        v-for="badge in badges" 
        :key="badge.id"
        class="badge-item"
        :class="{ 'selected': selectedBadgeId === badge.id }"
        @click="$emit('select', badge.id)"
      >
        <h3>{{ badge.name }}</h3>
        <p>{{ badge.description }}</p>
        <div class="badge-progress">
          <div 
            class="progress-bar"
            :style="{ width: `${badge.progress}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Badge } from '@atbadges/shared';

defineProps<{
  badges: Badge[];
  selectedBadgeId: string | null;
  isLoading: boolean;
  error: string | null;
  isDarkMode: boolean;
}>();

defineEmits<{
  (e: 'select', id: string): void;
  (e: 'create'): void;
  (e: 'toggle-theme'): void;
  (e: 'retry'): void;
}>();
</script>

<style scoped>
.badge-list {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--vscode-bg-light);
}

.badge-list-header {
  padding: 16px;
  border-bottom: 1px solid var(--vscode-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.badge-items {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.badge-item {
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 4px;
  background: var(--vscode-bg-lighter);
  cursor: pointer;
  transition: background-color 0.2s;
}

.badge-item:hover {
  background: var(--vscode-hover);
}

.badge-item.selected {
  background: var(--vscode-selection);
}

.badge-progress {
  height: 4px;
  background: var(--vscode-bg-lightest);
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: var(--vscode-progress-blue);
  transition: width 0.3s ease;
}

.loading, .error {
  padding: 16px;
  text-align: center;
  color: var(--vscode-fg-subtle);
}

.error button {
  margin-top: 8px;
  padding: 4px 8px;
  background: var(--vscode-bg-lighter);
  border: 1px solid var(--vscode-border);
  border-radius: 4px;
  cursor: pointer;
}

.error button:hover {
  background: var(--vscode-hover);
}

.create-button {
  background: var(--vscode-focus);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.create-button:hover {
  opacity: 0.9;
}
</style> 