<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Search as SearchIcon,
  Plus as PlusIcon,
  AlertCircle as AlertCircleIcon,
  Loader as LoaderIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
  Inbox as InboxIcon
} from 'lucide-vue-next'

// Temporary type until we fix the imports
type Badge = {
  id: string
  name: string
  description: string
  status: BadgeStatus
  progress: number
}

enum BadgeStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

interface Props {
  badges: Badge[]
  selectedBadgeId: string | null
  isLoading?: boolean
  error?: string | null
  isDarkMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  error: null,
  isDarkMode: true
})

const searchQuery = ref('')

const filteredBadges = computed(() => {
  if (!searchQuery.value) return props.badges
  
  const query = searchQuery.value.toLowerCase()
  return props.badges.filter(badge => 
    badge.name.toLowerCase().includes(query) || 
    badge.description.toLowerCase().includes(query)
  )
})

defineEmits<{
  (e: 'select', id: string): void
  (e: 'create'): void
  (e: 'toggle-theme'): void
  (e: 'retry'): void
}>()

const getStatusClass = (status: BadgeStatus) => {
  switch (status) {
    case BadgeStatus.NOT_STARTED:
      return 'status-not-started'
    case BadgeStatus.IN_PROGRESS:
      return 'status-in-progress'
    case BadgeStatus.COMPLETED:
      return 'status-completed'
    default:
      return ''
  }
}

const getStatusLabel = (status: BadgeStatus) => {
  switch (status) {
    case BadgeStatus.NOT_STARTED:
      return 'Not started'
    case BadgeStatus.IN_PROGRESS:
      return 'In progress'
    case BadgeStatus.COMPLETED:
      return 'Completed'
    default:
      return 'Unknown status'
  }
}
</script>

<template>
  <div class="sidebar-content">
    <div class="sidebar-header">
      <h2 class="sidebar-title">Badges</h2>
      <div class="sidebar-actions">
        <button 
          class="action-button" 
          @click="$emit('create')" 
          aria-label="Create new badge"
        >
          <PlusIcon class="icon" />
        </button>
        <button 
          class="action-button" 
          @click="$emit('toggle-theme')" 
          aria-label="Toggle dark mode"
        >
          <SunIcon v-if="isDarkMode" class="icon" />
          <MoonIcon v-else class="icon" />
        </button>
      </div>
    </div>
    
    <div class="search-container">
      <SearchIcon class="search-icon" />
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search badges..." 
        class="search-input"
        aria-label="Search badges"
      />
    </div>
    
    <div v-if="isLoading" class="loading-container">
      <LoaderIcon class="loading-icon spin" />
      <span>Loading badges...</span>
    </div>
    
    <div v-else-if="error" class="error-container">
      <AlertCircleIcon class="error-icon" />
      <span>{{ error }}</span>
      <button @click="$emit('retry')" class="retry-button">Retry</button>
    </div>
    
    <div v-else-if="filteredBadges.length === 0" class="empty-container">
      <InboxIcon class="empty-icon" />
      <span>No badges found</span>
    </div>
    
    <ul v-else class="badge-list" role="tree">
      <li 
        v-for="badge in filteredBadges" 
        :key="badge.id" 
        class="badge-item" 
        :class="{ 'selected': selectedBadgeId === badge.id }"
        @click="$emit('select', badge.id)"
        @keydown.enter="$emit('select', badge.id)"
        @keydown.space="$emit('select', badge.id)"
        tabindex="0"
        role="treeitem"
        :aria-selected="selectedBadgeId === badge.id"
      >
        <div class="badge-item-content">
          <span 
            class="status-indicator" 
            :class="getStatusClass(badge.status)"
            :aria-label="getStatusLabel(badge.status)"
          ></span>
          <span class="badge-name">{{ badge.name }}</span>
          <span class="badge-progress">{{ badge.progress }}%</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar-header {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--vscode-border);
}

.sidebar-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sidebar-actions {
  display: flex;
  gap: 8px;
}

.icon {
  width: 16px;
  height: 16px;
}

.search-container {
  padding: 8px 16px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--vscode-fg-subtle);
}

.search-input {
  width: 100%;
  background-color: var(--vscode-bg-lighter);
  border: 1px solid var(--vscode-border);
  color: var(--vscode-fg);
  padding: 6px 8px 6px 32px;
  border-radius: 4px;
  font-size: 13px;
}

.search-input:focus {
  outline: 2px solid var(--vscode-focus);
  outline-offset: -1px;
  border-color: transparent;
}

.badge-list {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  flex: 1;
}

.badge-item {
  padding: 6px 16px;
  cursor: pointer;
  border-left: 2px solid transparent;
  transition: background-color 0.2s;
}

.badge-item:hover {
  background-color: var(--vscode-hover);
}

.badge-item.selected {
  background-color: var(--vscode-selection);
  border-left-color: var(--vscode-focus);
}

.badge-item:focus-visible {
  outline: 2px solid var(--vscode-focus);
  outline-offset: -2px;
}

.badge-item-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-not-started {
  background-color: var(--vscode-fg-subtle);
}

.status-in-progress {
  background-color: var(--vscode-progress-blue);
}

.status-completed {
  background-color: var(--vscode-success);
}

.badge-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
}

.badge-progress {
  font-size: 11px;
  color: var(--vscode-fg-subtle);
}

/* Loading and error states */
.loading-container,
.error-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  gap: 12px;
  color: var(--vscode-fg-subtle);
  text-align: center;
}

.loading-icon,
.error-icon,
.empty-icon {
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

/* Dark mode overrides */
:deep(.dark) {
  .action-button {
    color: var(--vscode-fg-subtle);
  }

  .action-button:hover {
    background-color: var(--vscode-hover);
    color: var(--vscode-fg);
  }

  .search-icon {
    color: var(--vscode-fg-subtle);
  }

  .search-input {
    background-color: var(--vscode-bg-lighter);
    border: 1px solid var(--vscode-border);
    color: var(--vscode-fg);
  }

  .badge-item:hover {
    background-color: var(--vscode-hover);
  }

  .badge-item.selected {
    background-color: var(--vscode-selection);
  }

  .badge-progress {
    color: var(--vscode-fg-subtle);
  }

  .loading-container,
  .error-container,
  .empty-container {
    color: var(--vscode-fg-subtle);
  }

  .retry-button {
    background-color: var(--vscode-bg-lighter);
    border: 1solid var(--vscode-border);
    color: var(--vscode-fg);
  }

  .retry-button:hover {
    background-color: var(--vscode-hover);
  }
}
</style> 