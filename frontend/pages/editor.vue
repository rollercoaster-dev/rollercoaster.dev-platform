<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { badgeService } from '../services/badgeService';
import MainLayout from '../components/layout/MainLayout.vue';
import FilesystemTree from '../components/filesystem/FilesystemTree.vue';
import EditorView from '../components/editor/EditorView.vue';
import AIAssistantPanel from '../components/ai/AIAssistantPanel.vue';
import type { Badge, BadgeProject, BadgeTab, BadgeStatus, Message } from '../types/badge';

// State
const badges = ref<Badge[]>([]);
const projects = ref<BadgeProject[]>([]);
const selectedItemId = ref<string | null>(null);
const selectedBadge = ref<Badge | null>(null);
const tabs = ref<BadgeTab[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const selectedBadgeLoading = ref(false);
const selectedBadgeError = ref<string | null>(null);

// Layout state
const isDarkMode = ref(true);
const leftSidebarCollapsed = ref(false);
const rightSidebarCollapsed = ref(true);
const isUpdating = ref(false);
const isUpdatingRequirements = ref(false);
const isCreating = ref(false);
const aiMessages = ref<Message[]>([]);

// Load badges from API
const loadBadges = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    // Fetch badges from backend API
    badges.value = await badgeService.getBadges();
    
    // Transform badges into file explorer structure
    buildFileStructure();
  } catch (err) {
    console.error('Error loading badges:', err);
    error.value = 'Failed to load badges. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

// Build file structure for explorer
const buildFileStructure = () => {
  // Create top-level folders
  const personalFolder: BadgeProject = {
    id: 'folder-personal',
    name: 'Personal',
    type: 'folder',
    expanded: true,
    children: []
  };
  
  const workFolder: BadgeProject = {
    id: 'folder-work',
    name: 'Work',
    type: 'folder',
    expanded: false,
    children: []
  };
  
  const learningFolder: BadgeProject = {
    id: 'folder-learning',
    name: 'Learning',
    type: 'folder',
    expanded: false,
    children: []
  };
  
  // Add badges to appropriate folders based on content or some other criteria
  badges.value.forEach(badge => {
    const badgeItem: BadgeProject = {
      id: badge.id,
      name: badge.name,
      type: 'badge',
      progress: badge.progress,
      badge: badge
    };
    
    // Simple categorization based on name content
    // In a real app, you'd have proper categories or tags
    if (badge.name.toLowerCase().includes('learning') || 
        badge.name.toLowerCase().includes('study') ||
        badge.name.toLowerCase().includes('course')) {
      learningFolder.children?.push(badgeItem);
    } else if (badge.name.toLowerCase().includes('work') ||
               badge.name.toLowerCase().includes('project') ||
               badge.name.toLowerCase().includes('task')) {
      workFolder.children?.push(badgeItem);
    } else {
      personalFolder.children?.push(badgeItem);
    }
  });
  
  // Only include folders that have badges
  projects.value = [];
  
  if (personalFolder.children && personalFolder.children.length > 0) {
    projects.value.push(personalFolder);
  }
  
  if (workFolder.children && workFolder.children.length > 0) {
    projects.value.push(workFolder);
  }
  
  if (learningFolder.children && learningFolder.children.length > 0) {
    projects.value.push(learningFolder);
  }
  
  // Create a folder for notes
  const notesFolder: BadgeProject = {
    id: 'folder-notes',
    name: 'Notes',
    type: 'folder',
    expanded: false,
    children: [
      {
        id: 'file-getting-started',
        name: 'getting-started.md',
        type: 'file',
        content: '# Getting Started with Badges\n\nBadges help you track your progress on various goals and projects.\n\n## How to use badges effectively\n\n1. Break down your goals into specific requirements\n2. Set realistic timelines\n3. Update your progress regularly\n4. Use the AI assistant for guidance'
      }
    ]
  };
  
  projects.value.push(notesFolder);
};

// Handle file tree interactions
const selectItem = async (id: string) => {
  selectedItemId.value = id;
  
  // Find the selected item in the projects structure
  const findItem = (items: BadgeProject[]): BadgeProject | null => {
    for (const item of items) {
      if (item.id === id) {
        return item;
      }
      
      if (item.children && item.children.length > 0) {
        const found = findItem(item.children);
        if (found) return found;
      }
    }
    
    return null;
  };
  
  const selectedItem = findItem(projects.value);
  
  if (selectedItem && selectedItem.type === 'badge') {
    // Load badge details if this is a badge
    await loadSelectedBadge(id);
  } else {
    // For files or other items, just set the content
    selectedBadge.value = null;
  }
};

const toggleNode = (id: string, expanded: boolean) => {
  // Find and update the expanded state of the folder
  const updateExpanded = (items: BadgeProject[]): boolean => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].id === id) {
        items[i].expanded = expanded;
        return true;
      }
      
      if (items[i].children && items[i].children.length > 0) {
        const found = updateExpanded(items[i].children);
        if (found) return true;
      }
    }
    
    return false;
  };
  
  updateExpanded(projects.value);
};

// Load selected badge details
const loadSelectedBadge = async (id: string) => {
  selectedBadgeLoading.value = true;
  selectedBadgeError.value = null;
  
  try {
    const badge = await badgeService.getBadgeById(id);
    selectedBadge.value = badge;
    
    // Automatically create a tab for this badge if none exists
    if (!tabs.value.some(tab => tab.badgeId === id)) {
      createTab(id, 'badge');
    }
  } catch (err) {
    console.error('Error loading badge details:', err);
    selectedBadgeError.value = 'Failed to load badge details. Please try again.';
  } finally {
    selectedBadgeLoading.value = false;
  }
};

// Tab management
const createTab = (badgeId: string, type: string) => {
  const badge = badges.value.find(b => b.id === badgeId);
  if (!badge) return;
  
  // Create tab title based on type
  let title = badge.name;
  switch (type) {
    case 'requirements':
      title = `${badge.name} - Requirements`;
      break;
    case 'progress':
      title = `${badge.name} - Progress`;
      break;
    case 'notes':
      title = `${badge.name} - Notes`;
      break;
  }
  
  // Deactivate all current tabs
  tabs.value.forEach(tab => tab.active = false);
  
  // Create new tab
  const newTab: BadgeTab = {
    id: uuidv4(),
    badgeId,
    title,
    type,
    active: true
  };
  
  tabs.value.push(newTab);
};

const selectTab = (tabId: string) => {
  tabs.value.forEach(tab => {
    tab.active = tab.id === tabId;
    
    // Load the badge associated with the tab if needed
    if (tab.active && tab.badgeId !== selectedBadge.value?.id) {
      loadSelectedBadge(tab.badgeId);
    }
  });
};

const closeTab = (tabId: string) => {
  const tabIndex = tabs.value.findIndex(tab => tab.id === tabId);
  if (tabIndex === -1) return;
  
  const isActive = tabs.value[tabIndex].active;
  tabs.value.splice(tabIndex, 1);
  
  // If there are remaining tabs and we closed an active tab, activate the next tab
  if (isActive && tabs.value.length > 0) {
    // Try to activate the tab to the left, or the first tab if there's no tab to the left
    const newActiveIndex = Math.min(tabIndex, tabs.value.length - 1);
    tabs.value[newActiveIndex].active = true;
    
    // Load the badge for the newly activated tab
    loadSelectedBadge(tabs.value[newActiveIndex].badgeId);
  }
};

// CRUD operations
const createBadge = async () => {
  // TODO: Implement badge creation with a form
  // This would typically open a modal dialog
  console.log('Create new badge');
};

const updateBadge = async (id: string, updatedData: Partial<Badge>) => {
  isUpdating.value = true;
  
  try {
    const updatedBadge = await badgeService.updateBadge(id, updatedData);
    
    // Update local state
    const index = badges.value.findIndex(b => b.id === id);
    if (index !== -1) {
      badges.value[index] = updatedBadge;
    }
    
    if (selectedBadge.value?.id === id) {
      selectedBadge.value = updatedBadge;
    }
    
    // Update the file structure
    buildFileStructure();
  } catch (err) {
    console.error('Error updating badge:', err);
    // Show error notification
  } finally {
    isUpdating.value = false;
  }
};

const updateBadgeContent = async (content: string) => {
  if (!selectedBadge.value) return;
  
  await updateBadge(selectedBadge.value.id, { content });
};

const updateBadgeProgress = async (progress: number) => {
  if (!selectedBadge.value) return;
  
  await updateBadge(selectedBadge.value.id, { progress });
};

const toggleRequirement = async (payload: { id: string; completed: boolean }) => {
  if (!selectedBadge.value) return;
  
  isUpdatingRequirements.value = true;
  
  try {
    // Find requirement and update it locally first
    const requirement = selectedBadge.value.requirements.find(r => r.id === payload.id);
    if (!requirement) return;
    
    requirement.completed = payload.completed;
    
    // Calculate new progress
    const totalReqs = selectedBadge.value.requirements.length;
    const completedReqs = selectedBadge.value.requirements.filter(r => r.completed).length;
    const newProgress = Math.round((completedReqs / totalReqs) * 100);
    
    // Update on the server
    const progressData = {
      progress: newProgress,
      requirements: selectedBadge.value.requirements.map(r => ({
        id: r.id,
        completed: r.completed
      }))
    };
    
    const updatedBadge = await badgeService.updateBadgeProgress(
      selectedBadge.value.id, 
      progressData
    );
    
    // Update local state
    selectedBadge.value = updatedBadge;
    
    // Update badge in badges list
    const index = badges.value.findIndex(b => b.id === updatedBadge.id);
    if (index !== -1) {
      badges.value[index] = updatedBadge;
    }
    
    // Update file structure
    buildFileStructure();
  } catch (err) {
    console.error('Error updating requirement:', err);
    // Show error notification
  } finally {
    isUpdatingRequirements.value = false;
  }
};

const addRequirement = async (requirement: { description: string }) => {
  if (!selectedBadge.value) return;
  
  // Add requirement locally first
  const newRequirement = {
    id: uuidv4(),
    description: requirement.description,
    completed: false
  };
  
  selectedBadge.value.requirements.push(newRequirement);
  
  // Update on server
  await updateBadge(selectedBadge.value.id, {
    requirements: selectedBadge.value.requirements
  });
};

const removeRequirement = async (id: string) => {
  if (!selectedBadge.value) return;
  
  // Remove requirement locally first
  selectedBadge.value.requirements = selectedBadge.value.requirements.filter(r => r.id !== id);
  
  // Update on server
  await updateBadge(selectedBadge.value.id, {
    requirements: selectedBadge.value.requirements
  });
};

const deleteBadge = async (id: string) => {
  if (confirm('Are you sure you want to delete this badge? This action cannot be undone.')) {
    try {
      await badgeService.deleteBadge(id);
      
      // Update local state
      badges.value = badges.value.filter(b => b.id !== id);
      
      // Close any tabs related to this badge
      tabs.value = tabs.value.filter(tab => tab.badgeId !== id);
      
      // Clear selected badge if it was the one deleted
      if (selectedBadge.value?.id === id) {
        selectedBadge.value = null;
      }
      
      // Update file structure
      buildFileStructure();
    } catch (err) {
      console.error('Error deleting badge:', err);
      // Show error notification
    }
  }
};

// AI Assistant handlers
const sendAiMessage = (content: string, badgeId?: string) => {
  console.log('Send message to AI assistant:', content, badgeId);
  // In a real implementation, this would send the message to an AI backend
};

const clearAiChat = () => {
  aiMessages.value = [];
};

// Theme and layout handlers
const toggleDarkMode = (isDark: boolean) => {
  isDarkMode.value = isDark;
};

const toggleLeftSidebar = (isCollapsed: boolean) => {
  leftSidebarCollapsed.value = isCollapsed;
};

const toggleRightSidebar = (isCollapsed: boolean) => {
  rightSidebarCollapsed.value = isCollapsed;
};

// Load data on mount
onMounted(() => {
  loadBadges();
});
</script>

<template>
  <MainLayout
    :initial-dark-mode="isDarkMode"
    :initial-left-sidebar-collapsed="leftSidebarCollapsed"
    :initial-right-sidebar-collapsed="rightSidebarCollapsed"
    @dark-mode-toggle="toggleDarkMode"
    @left-sidebar-toggle="toggleLeftSidebar"
    @right-sidebar-toggle="toggleRightSidebar"
  >
    <!-- Left Sidebar: File Explorer -->
    <template #left-sidebar>
      <FilesystemTree
        :projects="projects"
        :selected-item-id="selectedItemId"
        :is-loading="isLoading"
        :error="error"
        @select="selectItem"
        @toggle="toggleNode"
        @create-folder="createFolder"
        @create-badge="createBadge"
        @retry="loadBadges"
      />
    </template>
    
    <!-- Main Content: Editor View -->
    <template #main-content>
      <EditorView
        :selected-badge="selectedBadge"
        :tabs="tabs"
        :is-loading="selectedBadgeLoading"
        :is-updating="isUpdating"
        :is-updating-requirements="isUpdatingRequirements"
        :error="selectedBadgeError"
        @select-tab="selectTab"
        @close-tab="closeTab"
        @create-tab="createTab"
        @create-badge="createBadge"
        @edit-badge="editBadge"
        @delete-badge="deleteBadge"
        @toggle-requirement="toggleRequirement"
        @add-requirement="addRequirement"
        @remove-requirement="removeRequirement"
        @update-progress="updateBadgeProgress"
        @update-content="updateBadgeContent"
        @retry="loadSelectedBadge(selectedBadge!.id)"
      />
    </template>
    
    <!-- Right Sidebar: AI Assistant -->
    <template #right-sidebar>
      <AIAssistantPanel
        :is-collapsed="rightSidebarCollapsed"
        :selected-badge-id="selectedBadge?.id"
        @toggle="toggleRightSidebar(!rightSidebarCollapsed)"
        @send-message="sendAiMessage"
        @clear-chat="clearAiChat"
      />
    </template>
    
    <!-- Status Bar Left -->
    <template #status-left>
      <span v-if="selectedBadge">Badge: {{ selectedBadge.name }}</span>
      <span v-else>No badge selected</span>
    </template>
    
    <!-- Status Bar Right -->
    <template #status-right>
      <span v-if="selectedBadge" class="ml-4">Progress: {{ selectedBadge.progress }}%</span>
    </template>
  </MainLayout>
</template>

<style>
/* Global color variables and themes */
:root {
  /* Dark theme (default) */
  --explorer-bg: #1e1e1e;
  --explorer-icon-color: #888888;
  --explorer-hover-bg: #2a2a2a;
  --explorer-hover-color: #d4d4d4;
  --explorer-input-bg: #252525;
  --explorer-border-color: #3a3a3a;
  --explorer-text-color: #d4d4d4;
  --explorer-focus-color: #0e639c;
  --explorer-subtle-color: #6a6a6a;
  --explorer-error-color: #f14c4c;
  --explorer-button-bg: #252525;
  --explorer-button-hover-bg: #2a2a2a;
  
  --editor-bg: #1e1e1e;
  --editor-text: #d4d4d4;
  --tabs-bg: #252525;
  --tabs-border: #333333;
  --tab-bg: #2d2d2d;
  --tab-text: #969696;
  --tab-hover-bg: #313131;
  --tab-active-bg: #1e1e1e;
  --tab-active-text: #ffffff;
  --tab-active-border: #1e1e1e;
  --tab-close-hover: rgba(255, 255, 255, 0.1);
  --editor-content-bg: #1e1e1e;
  --status-bar-bg: #252525;
  --status-bar-text: #9d9d9d;
  --status-not-started-bg: #2d2d2d;
  --status-not-started-text: #9d9d9d;
  --status-in-progress-bg: #064b92;
  --status-in-progress-text: #ffffff;
  --status-completed-bg: #10431b;
  --status-completed-text: #ffffff;
  --empty-state-text: #6a6a6a;
  --error-icon: #f14c4c;
  --button-bg: #0e639c;
  --button-text: #ffffff;
  --button-hover-bg: #1177bb;
  
  --ai-bg: #1e1e1e;
  --ai-text: #d4d4d4;
  --ai-icon-color: #888888;
  --ai-hover-bg: #2a2a2a;
  --ai-hover-color: #d4d4d4;
  --ai-scrollbar-thumb: #555;
  --ai-scrollbar-track: transparent;
  --ai-welcome-text: #9d9d9d;
  --ai-suggestion-bg: #2d2d2d;
  --ai-suggestion-text: #d4d4d4;
  --ai-suggestion-border: #3d3d3d;
  --ai-suggestion-hover-bg: #3d3d3d;
  --ai-user-msg-bg: #0e639c;
  --ai-user-msg-text: #ffffff;
  --ai-msg-bg: #2d2d2d;
  --ai-msg-text: #d4d4d4;
  --ai-meta-text: rgba(255, 255, 255, 0.6);
  --ai-input-bg: #1e1e1e;
  --ai-textarea-bg: #252525;
  --ai-textarea-border: #3d3d3d;
  --ai-textarea-text: #d4d4d4;
  --ai-textarea-focus: #0e639c;
  --ai-clear-button: #9d9d9d;
  --ai-clear-hover: rgba(157, 157, 157, 0.1);
  --ai-send-button: #0e639c;
  --ai-send-hover: rgba(14, 99, 156, 0.1);
  
  --node-hover-bg: #2a2a2a;
  --node-selected-bg: #37373d;
  --node-focus-outline: #007fd4;
  --node-icon-color: #c5c5c5;
  --node-text-color: #d4d4d4;
  --folder-icon-color: #e3a700;
  --badge-icon-color: #388bfd;
  --file-icon-color: #c5c5c5;
  --image-icon-color: #73c991;
  --progress-bg: #3a3a3a;
  --progress-started: #3b82f6;
  --progress-halfway: #3b82f6;
  --progress-complete: #22c55e;
  
  --title-color: #ffffff;
  --description-color: #d4d4d4;
  --section-title-color: #d4d4d4;
  --progress-text: #d4d4d4;
  --details-text: #9d9d9d;
  --completed-color: #22c55e;
  --pending-color: #9d9d9d;
  --date-icon-color: #0e639c;
  --date-label-color: #9d9d9d;
  --date-value-color: #d4d4d4;
  --item-border: #333333;
  --requirement-text: #d4d4d4;
  --completed-text: #757575;
  --content-bg: #272727;
  --content-border: #333333;
  --content-text: #d4d4d4;
  --metadata-border: #333333;
  --metadata-text: #9d9d9d;
  --metadata-icon: #9d9d9d;
  --button-border: #3a3a3a;
  --edit-button-color: #0e639c;
  --edit-button-hover: rgba(14, 99, 156, 0.1);
  --delete-button-color: #cc3e3e;
  --delete-button-hover: rgba(204, 62, 62, 0.1);
}

/* Light theme */
:root .vs-code-app:not(.dark) {
  --explorer-bg: #f5f5f5;
  --explorer-icon-color: #616161;
  --explorer-hover-bg: #e0e0e0;
  --explorer-hover-color: #424242;
  --explorer-input-bg: #ffffff;
  --explorer-border-color: #e0e0e0;
  --explorer-text-color: #424242;
  --explorer-focus-color: #0078d4;
  --explorer-subtle-color: #757575;
  --explorer-error-color: #d32f2f;
  --explorer-button-bg: #f5f5f5;
  --explorer-button-hover-bg: #e0e0e0;
  
  --editor-bg: #ffffff;
  --editor-text: #333333;
  --tabs-bg: #f5f5f5;
  --tabs-border: #e0e0e0;
  --tab-bg: #ececec;
  --tab-text: #616161;
  --tab-hover-bg: #e0e0e0;
  --tab-active-bg: #ffffff;
  --tab-active-text: #333333;
  --tab-active-border: #ffffff;
  --tab-close-hover: rgba(0, 0, 0, 0.1);
  --editor-content-bg: #ffffff;
  --status-bar-bg: #0078d4;
  --status-bar-text: #ffffff;
  --status-not-started-bg: #f5f5f5;
  --status-not-started-text: #616161;
  --status-in-progress-bg: #e3f2fd;
  --status-in-progress-text: #0078d4;
  --status-completed-bg: #e8f5e9;
  --status-completed-text: #2e7d32;
  --empty-state-text: #757575;
  --error-icon: #d32f2f;
  --button-bg: #0078d4;
  --button-text: #ffffff;
  --button-hover-bg: #106ebe;
  
  --ai-bg: #f5f5f5;
  --ai-text: #333333;
  --ai-icon-color: #616161;
  --ai-hover-bg: #e0e0e0;
  --ai-hover-color: #424242;
  --ai-scrollbar-thumb: #bdbdbd;
  --ai-scrollbar-track: transparent;
  --ai-welcome-text: #616161;
  --ai-suggestion-bg: #f0f0f0;
  --ai-suggestion-text: #333333;
  --ai-suggestion-border: #e0e0e0;
  --ai-suggestion-hover-bg: #e0e0e0;
  --ai-user-msg-bg: #0078d4;
  --ai-user-msg-text: #ffffff;
  --ai-msg-bg: #f0f0f0;
  --ai-msg-text: #333333;
  --ai-meta-text: rgba(0, 0, 0, 0.6);
  --ai-input-bg: #f5f5f5;
  --ai-textarea-bg: #ffffff;
  --ai-textarea-border: #e0e0e0;
  --ai-textarea-text: #333333;
  --ai-textarea-focus: #0078d4;
  --ai-clear-button: #616161;
  --ai-clear-hover: rgba(97, 97, 97, 0.1);
  --ai-send-button: #0078d4;
  --ai-send-hover: rgba(0, 120, 212, 0.1);
  
  --node-hover-bg: #e0e0e0;
  --node-selected-bg: #e3f2fd;
  --node-focus-outline: #0078d4;
  --node-icon-color: #616161;
  --node-text-color: #333333;
  --folder-icon-color: #e3a600;
  --badge-icon-color: #0078d4;
  --file-icon-color: #616161;
  --image-icon-color: #4caf50;
  --progress-bg: #e0e0e0;
  --progress-started: #2196f3;
  --progress-halfway: #2196f3;
  --progress-complete: #4caf50;
  
  --title-color: #333333;
  --description-color: #424242;
  --section-title-color: #333333;
  --progress-text: #333333;
  --details-text: #616161;
  --completed-color: #4caf50;
  --pending-color: #757575;
  --date-icon-color: #0078d4;
  --date-label-color: #616161;
  --date-value-color: #333333;
  --item-border: #e0e0e0;
  --requirement-text: #333333;
  --completed-text: #9e9e9e;
  --content-bg: #f5f5f5;
  --content-border: #e0e0e0;
  --content-text: #333333;
  --metadata-border: #e0e0e0;
  --metadata-text: #616161;
  --metadata-icon: #616161;
  --button-border: #e0e0e0;
  --edit-button-color: #0078d4;
  --edit-button-hover: rgba(0, 120, 212, 0.1);
  --delete-button-color: #d32f2f;
  --delete-button-hover: rgba(211, 47, 47, 0.1);
}
</style>