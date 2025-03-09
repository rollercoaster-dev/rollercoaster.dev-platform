<template>
  <div class="editor-view flex flex-col h-full">
    <!-- Tabs -->
    <div class="editor-tabs flex border-b border-[#333333] overflow-x-auto">
      <div 
        v-for="tab in tabs" 
        :key="tab.id"
        class="editor-tab flex items-center"
        :class="{ 'active': tab.active }"
        @click="selectTab(tab.id)"
      >
        <component :is="getTabIcon(tab)" class="tab-icon" />
        <span class="tab-title">{{ tab.title }}</span>
        <button 
          class="close-button"
          @click.stop="closeTab(tab.id)"
          aria-label="Close tab"
        >
          <XIcon class="close-icon" />
        </button>
      </div>
    </div>
    
    <!-- Editor Content -->
    <div class="editor-content flex-1 overflow-auto">
      <div 
        v-if="!currentTab"
        class="empty-editor flex flex-col items-center justify-center h-full text-center"
      >
        <div class="empty-content">
          <FileIcon class="empty-icon" />
          <h2 class="empty-title">No Badge Selected</h2>
          <p class="empty-description">Select a badge from the explorer to view or edit.</p>
          <button 
            class="create-button"
            @click="$emit('createBadge')"
          >
            Create New Badge
          </button>
        </div>
      </div>
      
      <div 
        v-else-if="isLoading"
        class="loading-editor flex flex-col items-center justify-center h-full"
      >
        <LoaderIcon class="loading-icon spin" />
        <span>Loading content...</span>
      </div>
      
      <div 
        v-else-if="error"
        class="error-editor flex flex-col items-center justify-center h-full text-center"
      >
        <AlertCircleIcon class="error-icon" />
        <h2 class="error-title">{{ error }}</h2>
        <button 
          class="retry-button"
          @click="$emit('retry')"
        >
          Retry
        </button>
      </div>
      
      <div v-else class="badge-editor p-4">
        <!-- Badge Overview Tab -->
        <BadgeOverview 
          v-if="currentTab?.type === 'badge' && selectedBadge"
          :badge="selectedBadge"
          @edit="$emit('editBadge', selectedBadge.id)"
          @delete="$emit('deleteBadge', selectedBadge.id)"
        />
        
        <!-- Requirements Tab -->
        <BadgeRequirements 
          v-else-if="currentTab?.type === 'requirements' && selectedBadge"
          :badge="selectedBadge"
          :is-updating="isUpdatingRequirements"
          @toggle-requirement="handleToggleRequirement"
          @add-requirement="$emit('addRequirement', $event)"
          @remove-requirement="$emit('removeRequirement', $event)"
        />
        
        <!-- Progress Tab -->
        <BadgeProgress 
          v-else-if="currentTab?.type === 'progress' && selectedBadge"
          :badge="selectedBadge"
          :is-updating="isUpdating"
          @update-progress="$emit('updateProgress', $event)"
        />
        
        <!-- Notes Tab -->
        <BadgeNotes 
          v-else-if="currentTab?.type === 'notes' && selectedBadge"
          :badge="selectedBadge"
          :is-updating="isUpdating"
          @update-content="$emit('updateContent', $event)"
        />
      </div>
    </div>
    
    <!-- Status Bar -->
    <div v-if="selectedBadge" class="editor-status flex items-center justify-between px-4 py-1 text-xs border-t border-[#333333]">
      <div class="flex items-center gap-2">
        <span class="status-badge" :class="getBadgeStatusClass(selectedBadge.status)">
          {{ getBadgeStatusLabel(selectedBadge.status) }}
        </span>
        <span class="status-progress">{{ selectedBadge.progress }}%</span>
      </div>
      <div class="flex items-center gap-4">
        <div v-if="selectedBadge.startDate" class="flex items-center">
          <CalendarIcon class="status-icon" />
          <span>Started: {{ formatDate(selectedBadge.startDate) }}</span>
        </div>
        <div v-if="selectedBadge.targetDate" class="flex items-center">
          <TargetIcon class="status-icon" />
          <span>Due: {{ formatDate(selectedBadge.targetDate) }}</span>
        </div>
        <span>Last updated: {{ formatDate(selectedBadge.updatedAt) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { 
  X as XIcon,
  File as FileIcon,
  FileText as FileTextIcon,
  Award as AwardIcon,
  CheckSquare as CheckSquareIcon,
  BarChart as BarChartIcon,
  PenLine as PenLineIcon,
  AlertCircle as AlertCircleIcon,
  Loader as LoaderIcon,
  Calendar as CalendarIcon,
  Target as TargetIcon
} from 'lucide-vue-next';
import type { Badge, BadgeTab } from '../../types/badge';

// Import badge components
import BadgeOverview from '../badge/BadgeOverview.vue';
import BadgeRequirements from '../badge/BadgeRequirements.vue';
import BadgeProgress from '../badge/BadgeProgress.vue';
import BadgeNotes from '../badge/BadgeNotes.vue';

// Props
interface Props {
  selectedBadge: Badge | null;
  tabs: BadgeTab[];
  isLoading?: boolean;
  isUpdating?: boolean;
  isUpdatingRequirements?: boolean;
  error?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  isUpdating: false,
  isUpdatingRequirements: false,
  error: null
});

// Computed
const currentTab = computed(() => props.tabs.find(tab => tab.active));

// Methods
const getTabIcon = (tab: BadgeTab) => {
  switch (tab.type) {
    case 'badge':
      return AwardIcon;
    case 'requirements':
      return CheckSquareIcon;
    case 'progress':
      return BarChartIcon;
    case 'notes':
      return PenLineIcon;
    default:
      return FileTextIcon;
  }
};

const selectTab = (tabId: string) => {
  emit('selectTab', tabId);
};

const closeTab = (tabId: string) => {
  emit('closeTab', tabId);
};

const getBadgeStatusClass = (status: string) => {
  switch (status) {
    case 'NOT_STARTED':
      return 'status-not-started';
    case 'IN_PROGRESS':
      return 'status-in-progress';
    case 'COMPLETED':
      return 'status-completed';
    default:
      return '';
  }
};

const getBadgeStatusLabel = (status: string) => {
  switch (status) {
    case 'NOT_STARTED':
      return 'Not Started';
    case 'IN_PROGRESS':
      return 'In Progress';
    case 'COMPLETED':
      return 'Completed';
    default:
      return 'Unknown';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const handleToggleRequirement = (payload: { id: string; completed: boolean }) => {
  emit('toggleRequirement', payload);
};

// Emit events
const emit = defineEmits<{
  (e: 'selectTab', id: string): void
  (e: 'closeTab', id: string): void
  (e: 'createTab', badgeId: string, type: string): void
  (e: 'createBadge'): void
  (e: 'editBadge', id: string): void
  (e: 'deleteBadge', id: string): void
  (e: 'toggleRequirement', payload: { id: string; completed: boolean }): void
  (e: 'addRequirement', requirement: { description: string }): void
  (e: 'removeRequirement', id: string): void
  (e: 'updateProgress', progress: number): void
  (e: 'updateContent', content: string): void
  (e: 'retry'): void
}>();

// Watch for selected badge changes
watch(() => props.selectedBadge, (newBadge) => {
  if (newBadge && !props.tabs.some(t => t.badgeId === newBadge.id)) {
    // Automatically create default tab for selected badge if none exists
    emit('createTab', newBadge.id, 'badge');
  }
});
</script>

<style scoped>
.editor-view {
  background-color: var(--editor-bg, #1e1e1e);
  color: var(--editor-text, #d4d4d4);
}

.editor-tabs {
  background-color: var(--tabs-bg, #252525);
  height: 35px;
}

.editor-tab {
  padding: 0 10px;
  height: 35px;
  border-right: 1px solid var(--tabs-border, #333333);
  background-color: var(--tab-bg, #2d2d2d);
  color: var(--tab-text, #969696);
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s;
  min-width: 120px;
  max-width: 200px;
  position: relative;
}

.editor-tab:hover {
  background-color: var(--tab-hover-bg, #313131);
}

.editor-tab.active {
  background-color: var(--tab-active-bg, #1e1e1e);
  color: var(--tab-active-text, #ffffff);
  border-bottom: 1px solid var(--tab-active-border, #1e1e1e);
}

.tab-icon {
  width: 14px;
  height: 14px;
  margin-right: 6px;
}

.tab-title {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  margin-left: 6px;
  opacity: 0.7;
}

.close-button:hover {
  background-color: var(--tab-close-hover, rgba(255, 255, 255, 0.1));
  opacity: 1;
}

.close-icon {
  width: 14px;
  height: 14px;
}

.editor-content {
  background-color: var(--editor-content-bg, #1e1e1e);
}

.editor-status {
  background-color: var(--status-bar-bg, #252525);
  color: var(--status-bar-text, #9d9d9d);
  height: 22px;
}

.status-icon {
  width: 12px;
  height: 12px;
  margin-right: 4px;
}

.status-badge {
  padding: 1px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
}

.status-badge.status-not-started {
  background-color: var(--status-not-started-bg, #2d2d2d);
  color: var(--status-not-started-text, #9d9d9d);
}

.status-badge.status-in-progress {
  background-color: var(--status-in-progress-bg, #064b92);
  color: var(--status-in-progress-text, #ffffff);
}

.status-badge.status-completed {
  background-color: var(--status-completed-bg, #10431b);
  color: var(--status-completed-text, #ffffff);
}

/* Empty, loading and error states */
.empty-editor, .loading-editor, .error-editor {
  color: var(--empty-state-text, #6a6a6a);
}

.empty-icon, .loading-icon, .error-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
  opacity: 0.7;
}

.error-icon {
  color: var(--error-icon, #f14c4c);
}

.empty-title, .error-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.empty-description {
  margin-bottom: 16px;
}

.create-button, .retry-button {
  background-color: var(--button-bg, #0e639c);
  color: var(--button-text, #ffffff);
  border: none;
  padding: 6px 14px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.create-button:hover, .retry-button:hover {
  background-color: var(--button-hover-bg, #1177bb);
}

.spin {
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>