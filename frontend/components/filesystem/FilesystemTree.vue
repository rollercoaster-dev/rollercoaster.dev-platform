<template>
  <div class="filesystem-explorer flex flex-col h-full">
    <!-- Explorer Header -->
    <div class="explorer-header p-2 text-sm font-medium border-b border-[#333333] flex justify-between items-center">
      <span>EXPLORER</span>
      <div class="flex gap-1">
        <button 
          class="action-button"
          @click="$emit('createFolder')"
          aria-label="Create new folder"
        >
          <FolderPlusIcon class="icon" />
        </button>
        <button 
          class="action-button"
          @click="$emit('createBadge')"
          aria-label="Create new badge"
        >
          <PlusIcon class="icon" />
        </button>
      </div>
    </div>
    
    <!-- Search -->
    <div class="search-container p-2">
      <div class="relative">
        <SearchIcon class="search-icon" />
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search badges..." 
          class="search-input"
          aria-label="Search badges"
          @keydown.enter="$emit('search', searchQuery)"
        />
        <button 
          v-if="searchQuery"
          @click="clearSearch"
          class="clear-button"
          aria-label="Clear search"
        >
          <XIcon class="clear-icon" />
        </button>
      </div>
    </div>
    
    <!-- Tree View -->
    <div class="tree-view flex-1 overflow-y-auto p-1">
      <div v-if="isLoading" class="loading-container">
        <LoaderIcon class="loading-icon spin" />
        <span>Loading...</span>
      </div>
      
      <div v-else-if="error" class="error-container">
        <AlertCircleIcon class="error-icon" />
        <span>{{ error }}</span>
        <button @click="$emit('retry')" class="retry-button">Retry</button>
      </div>
      
      <div v-else-if="filteredProjects.length === 0" class="empty-container">
        <FolderIcon class="empty-icon" />
        <span>No badges found</span>
        <button 
          @click="$emit('createBadge')"
          class="create-button"
        >
          Create Badge
        </button>
      </div>
      
      <ul v-else class="tree-list" role="tree">
        <FileSystemNode 
          v-for="project in filteredProjects"
          :key="project.id"
          :node="project"
          :selected-item-id="selectedItemId"
          @select="selectItem"
          @toggle="toggleNode"
        />
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { 
  Search as SearchIcon,
  Plus as PlusIcon,
  FolderPlus as FolderPlusIcon,
  Folder as FolderIcon,
  AlertCircle as AlertCircleIcon,
  Loader as LoaderIcon,
  X as XIcon
} from 'lucide-vue-next';
import FileSystemNode from './FileSystemNode.vue';
import type { BadgeProject } from '../../types/badge';

// Props
interface Props {
  projects: BadgeProject[];
  selectedItemId?: string | null;
  isLoading?: boolean;
  error?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  selectedItemId: null,
  isLoading: false,
  error: null
});

// State
const searchQuery = ref('');

// Computed
const filteredProjects = computed(() => {
  if (!searchQuery.value) return props.projects;
  
  const query = searchQuery.value.toLowerCase();
  
  // Helper function to recursively search in project tree
  const searchInProject = (project: BadgeProject): BadgeProject | null => {
    // Check if current node matches
    if (
      project.name.toLowerCase().includes(query) ||
      (project.badge?.description.toLowerCase().includes(query))
    ) {
      return { ...project };
    }
    
    // If it has children, check them
    if (project.children && project.children.length > 0) {
      const matchingChildren = project.children
        .map(searchInProject)
        .filter(Boolean) as BadgeProject[];
      
      if (matchingChildren.length > 0) {
        return {
          ...project,
          children: matchingChildren,
          expanded: true // Auto expand when there are matching children
        };
      }
    }
    
    return null;
  };
  
  // Apply search to all projects
  return props.projects
    .map(searchInProject)
    .filter(Boolean) as BadgeProject[];
});

// Methods
const selectItem = (id: string) => {
  emit('select', id);
};

const toggleNode = (id: string, expanded: boolean) => {
  emit('toggle', id, expanded);
};

const clearSearch = () => {
  searchQuery.value = '';
};

// Emit events
const emit = defineEmits<{
  (e: 'select', id: string): void
  (e: 'toggle', id: string, expanded: boolean): void
  (e: 'createFolder'): void
  (e: 'createBadge'): void
  (e: 'search', query: string): void
  (e: 'retry'): void
}>();

// Reset search when projects change
watch(() => props.projects, () => {
  if (props.error === null && !props.isLoading) {
    searchQuery.value = '';
  }
});
</script>

<style scoped>
.filesystem-explorer {
  background-color: var(--explorer-bg, inherit);
}

.explorer-header {
  user-select: none;
}

.icon {
  width: 16px;
  height: 16px;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: transparent;
  color: var(--explorer-icon-color, #888888);
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-button:hover {
  background-color: var(--explorer-hover-bg, #2a2a2a);
  color: var(--explorer-hover-color, #d4d4d4);
}

.search-container {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: var(--explorer-icon-color, #888888);
}

.search-input {
  width: 100%;
  background-color: var(--explorer-input-bg, #252525);
  border: 1px solid var(--explorer-border-color, #3a3a3a);
  color: var(--explorer-text-color, #d4d4d4);
  padding: 6px 8px 6px 28px;
  border-radius: 4px;
  font-size: 12px;
}

.search-input:focus {
  outline: 1px solid var(--explorer-focus-color, #0e639c);
  border-color: transparent;
}

.clear-button {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--explorer-icon-color, #888888);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-icon {
  width: 14px;
  height: 14px;
}

.tree-view {
  position: relative;
}

.tree-list {
  list-style: none;
  padding: 0;
  margin: 0;
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
  color: var(--explorer-subtle-color, #6a6a6a);
  text-align: center;
  height: 100%;
}

.loading-icon,
.error-icon,
.empty-icon {
  width: 24px;
  height: 24px;
}

.error-icon {
  color: var(--explorer-error-color, #f14c4c);
}

.spin {
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.retry-button, .create-button {
  background-color: var(--explorer-button-bg, #252525);
  border: 1px solid var(--explorer-border-color, #3a3a3a);
  color: var(--explorer-text-color, #d4d4d4);
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-button:hover, .create-button:hover {
  background-color: var(--explorer-button-hover-bg, #2a2a2a);
}

/* Dark mode & light mode variables are set in parent component */
</style>