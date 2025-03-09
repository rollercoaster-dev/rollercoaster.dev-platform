<script setup lang="ts">
import { computed } from 'vue';
import { BadgeTab } from '../../types/badge';

interface Props {
  tabs: BadgeTab[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'select', id: string): void;
  (e: 'close', id: string): void;
  (e: 'createTab', badgeId: string, type: string): void;
}>();

// Computed
const activeTabs = computed(() => {
  return props.tabs.filter(tab => tab.active);
});

const activeTabId = computed(() => {
  const activeTab = props.tabs.find(tab => tab.active);
  return activeTab?.id || null;
});

// Methods
const selectTab = (tabId: string) => {
  emit('select', tabId);
};

const closeTab = (event: Event, tabId: string) => {
  event.stopPropagation();
  emit('close', tabId);
};

const getTypeIcon = (type: string): string => {
  switch (type) {
    case 'badge':
      return 'emoji_events';
    case 'requirements':
      return 'check_circle';
    case 'progress':
      return 'timeline';
    case 'notes':
      return 'description';
    default:
      return 'article';
  }
};

// Context menu for tabs
const showContextMenu = (event: MouseEvent, tab: BadgeTab) => {
  event.preventDefault();
  // For simplicity, we're just using a basic context menu here
  // In a real app, you might want to implement a more sophisticated context menu
  const result = window.prompt(
    `Tab options for "${tab.title}":\n1. View Badge\n2. View Requirements\n3. View Progress\n4. View Notes\n\nEnter option number:`
  );
  
  if (result) {
    const option = parseInt(result.trim());
    let type: string;
    
    switch (option) {
      case 1:
        type = 'badge';
        break;
      case 2:
        type = 'requirements';
        break;
      case 3:
        type = 'progress';
        break;
      case 4:
        type = 'notes';
        break;
      default:
        return;
    }
    
    emit('createTab', tab.badgeId, type);
  }
};
</script>

<template>
  <div class="file-tabs">
    <div class="tabs-container">
      <div 
        v-for="tab in tabs" 
        :key="tab.id"
        class="tab"
        :class="{ active: tab.active }"
        @click="selectTab(tab.id)"
        @contextmenu="showContextMenu($event, tab)"
      >
        <span class="material-icons tab-icon">{{ getTypeIcon(tab.type) }}</span>
        <span class="tab-title">{{ tab.title }}</span>
        <button 
          class="tab-close"
          @click="closeTab($event, tab.id)"
          aria-label="Close tab"
        >
          <span class="material-icons">close</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.file-tabs {
  background-color: var(--tabs-bg);
  border-bottom: 1px solid var(--tabs-border);
}

.tabs-container {
  display: flex;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--tab-text) transparent;
}

.tabs-container::-webkit-scrollbar {
  height: 6px;
}

.tabs-container::-webkit-scrollbar-track {
  background: transparent;
}

.tabs-container::-webkit-scrollbar-thumb {
  background-color: var(--tab-text);
  border-radius: 3px;
}

.tab {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background-color: var(--tab-bg);
  color: var(--tab-text);
  border-right: 1px solid var(--tabs-border);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  min-width: 120px;
  max-width: 200px;
  position: relative;
  transition: background-color 0.2s ease;
}

.tab:hover {
  background-color: var(--tab-hover-bg);
}

.tab.active {
  background-color: var(--tab-active-bg);
  color: var(--tab-active-text);
  border-bottom: 2px solid var(--explorer-focus-color);
}

.tab-icon {
  font-size: 16px;
  margin-right: 6px;
}

.tab-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  font-size: 0.9rem;
}

.tab-close {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-left: 8px;
  opacity: 0.7;
}

.tab-close:hover {
  background-color: var(--tab-close-hover);
  opacity: 1;
}

.tab-close .material-icons {
  font-size: 16px;
}

/* Material Icons */
.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}
</style>