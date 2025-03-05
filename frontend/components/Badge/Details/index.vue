<template>
  <div class="badge-details-container">
    <div v-if="!badge" class="empty-selection">
      <AwardIcon class="empty-selection-icon" />
      <h2>Select a badge to view details</h2>
      <button 
        class="create-button" 
        @click="$emit('create')"
      >
        Create New Badge
      </button>
    </div>
    
    <div v-else-if="isLoading" class="loading-container centered">
      <LoaderIcon class="loading-icon spin" />
      <span>Loading badge details...</span>
    </div>
    
    <div v-else-if="error" class="error-container centered">
      <AlertCircleIcon class="error-icon" />
      <span>{{ error }}</span>
      <button @click="$emit('retry')" class="retry-button">Retry</button>
    </div>
    
    <div v-else class="badge-details">
      <div class="badge-details-header">
        <h2 class="badge-title">{{ badge.name }}</h2>
        <div class="badge-actions">
          <button 
            class="action-button" 
            @click="$emit('edit')" 
            aria-label="Edit badge"
          >
            <EditIcon class="icon" />
          </button>
          <button 
            class="action-button danger" 
            @click="$emit('delete')" 
            aria-label="Delete badge"
          >
            <TrashIcon class="icon" />
          </button>
        </div>
      </div>
      
      <div class="badge-info">
        <p class="badge-description">{{ badge.description }}</p>
        
        <div class="badge-dates">
          <div v-if="badge.startDate" class="date-item">
            <CalendarIcon class="date-icon" />
            <span>Started: {{ formatDate(badge.startDate) }}</span>
          </div>
          <div v-if="badge.targetDate" class="date-item">
            <TargetIcon class="date-icon" />
            <span>Target: {{ formatDate(badge.targetDate) }}</span>
          </div>
        </div>
        
        <BadgeProgress :progress="badge.progress" />
        
        <BadgeRequirementsList 
          :requirements="badge.requirements"
          @toggle="(id, completed) => $emit('toggleRequirement', id, completed)"
        />
        
        <div v-if="badge.content" class="badge-content">
          <h3>Additional Content</h3>
          <div class="content-box">{{ badge.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  Award as AwardIcon,
  AlertCircle as AlertCircleIcon,
  Loader as LoaderIcon,
  Edit as EditIcon,
  Trash as TrashIcon,
  Calendar as CalendarIcon,
  Target as TargetIcon
} from 'lucide-vue-next'
import type { Badge } from '../../../types/badge'
import BadgeProgress from '../Progress/index.vue'
import BadgeRequirementsList from '../RequirementsList/index.vue'

interface Props {
  badge: Badge | null
  isLoading?: boolean
  error?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  error: null
})

defineEmits<{
  (e: 'create'): void
  (e: 'edit'): void
  (e: 'delete'): void
  (e: 'retry'): void
  (e: 'toggleRequirement', id: string, completed: boolean): void
}>()

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}
</script>

<style scoped>
.badge-details-container {
  height: 100%;
}

.empty-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
  color: var(--vscode-fg-subtle);
  text-align: center;
}

.empty-selection-icon {
  width: 48px;
  height: 48px;
  opacity: 0.7;
}

.create-button {
  background-color: var(--vscode-focus);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.create-button:hover {
  background-color: #0062a3;
}

.create-button:focus-visible {
  outline: 2px solid var(--vscode-focus);
  outline-offset: 2px;
}

.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  gap: 12px;
  color: var(--vscode-fg-subtle);
  text-align: center;
}

.loading-container.centered, 
.error-container.centered {
  height: 100%;
}

.loading-icon, .error-icon {
  width: 24px;
  height: 24px;
}

.error-icon {
  color: var(--vscode-error);
}

.spin {
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.retry-button {
  background-color: var(--vscode-bg-lighter);
  border: 1px solid var(--vscode-border);
  color: var(--vscode-fg);
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: var(--vscode-hover);
}

.badge-details {
  max-width: 800px;
}

.badge-details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.badge-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.badge-actions {
  display: flex;
  gap: 8px;
}

.action-button {
  background: transparent;
  border: none;
  color: var(--vscode-fg-subtle);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s, color 0.2s;
}

.action-button:hover {
  background-color: var(--vscode-hover);
  color: var(--vscode-fg);
}

.action-button.danger:hover {
  background-color: rgba(241, 76, 76, 0.2);
  color: var(--vscode-error);
}

.badge-description {
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 24px;
  color: var(--vscode-fg);
}

.badge-dates {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.date-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--vscode-fg-subtle);
}

.date-icon {
  width: 16px;
  height: 16px;
}

.badge-content {
  margin-top: 24px;
}

.badge-content h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.content-box {
  background-color: var(--vscode-bg-lighter);
  border: 1px solid var(--vscode-border);
  border-radius: 4px;
  padding: 16px;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
}

/* Dark mode overrides */
:deep(.badge-manager:not(.dark)) {
  .empty-selection {
    color: var(--vscode-light-fg-subtle);
  }

  .loading-container, .error-container {
    color: var(--vscode-light-fg-subtle);
  }

  .retry-button {
    background-color: var(--vscode-light-bg-lighter);
    border: 1px solid var(--vscode-light-border);
    color: var(--vscode-light-fg);
  }

  .retry-button:hover {
    background-color: var(--vscode-light-hover);
  }

  .badge-description {
    color: var(--vscode-light-fg);
  }

  .date-item {
    color: var(--vscode-light-fg-subtle);
  }

  .content-box {
    background-color: var(--vscode-light-bg-lighter);
    border: 1px solid var(--vscode-light-border);
  }
}
</style> 