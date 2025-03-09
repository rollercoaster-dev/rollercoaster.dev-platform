<template>
  <li 
    class="file-system-node"
    :class="{
      'is-folder': isFolder,
      'is-expanded': isFolder && node.expanded,
      'is-selected': isSelected
    }"
    :aria-expanded="isFolder ? (node.expanded ? 'true' : 'false') : undefined"
    :aria-selected="isSelected"
    role="treeitem"
  >
    <div 
      class="node-content"
      :class="{ 'selected': isSelected }"
      @click="handleClick"
      @dblclick="handleDoubleClick"
      tabindex="0"
      @keydown.enter="handleClick"
      @keydown.space="handleClick"
      @keydown.right="handleExpand"
      @keydown.left="handleCollapse"
    >
      <!-- Toggle button for folders -->
      <button 
        v-if="isFolder"
        class="toggle-button"
        @click.stop="toggle"
        aria-label="Toggle folder"
      >
        <ChevronRightIcon v-if="!node.expanded" class="chevron-icon" />
        <ChevronDownIcon v-else class="chevron-icon" />
      </button>
      
      <div v-else class="toggle-spacer"></div>
      
      <!-- Icon -->
      <component 
        :is="getNodeIcon()" 
        class="node-icon"
        :class="{
          'folder-icon': isFolder,
          'badge-icon': isBadge,
          'file-icon': isFile,
          'image-icon': isImage
        }"
      />
      
      <!-- Node name -->
      <span class="node-name">{{ node.name }}</span>
      
      <!-- Progress indicator for badges -->
      <div v-if="isBadge && node.progress !== undefined" class="progress-indicator">
        <div class="progress-bar">
          <div 
            class="progress-fill"
            :class="getProgressClass(node.progress)"
            :style="{ width: `${node.progress}%` }"
          ></div>
        </div>
      </div>
    </div>
    
    <!-- Children (recursively rendered) -->
    <ul 
      v-if="isFolder && node.expanded && node.children && node.children.length > 0" 
      class="children-list"
      role="group"
    >
      <FileSystemNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :selected-item-id="selectedItemId"
        :indent-level="indentLevel + 1"
        @select="$emit('select', $event)"
        @toggle="$emit('toggle', $event[0], $event[1])"
      />
    </ul>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { 
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  FileText as FileTextIcon,
  Award as AwardIcon,
  Image as ImageIcon,
  ChevronRight as ChevronRightIcon,
  ChevronDown as ChevronDownIcon
} from 'lucide-vue-next';
import type { BadgeProject } from '../../types/badge';

// Props
interface Props {
  node: BadgeProject;
  selectedItemId: string | null;
  indentLevel?: number;
}

const props = withDefaults(defineProps<Props>(), {
  indentLevel: 0
});

// Computed
const isFolder = computed(() => props.node.type === 'folder');
const isBadge = computed(() => props.node.type === 'badge');
const isFile = computed(() => props.node.type === 'file');
const isImage = computed(() => props.node.type === 'image');
const isSelected = computed(() => props.selectedItemId === props.node.id);

// Methods
const getNodeIcon = () => {
  if (isFolder.value) {
    return props.node.expanded ? FolderOpenIcon : FolderIcon;
  } else if (isBadge.value) {
    return AwardIcon;
  } else if (isImage.value) {
    return ImageIcon;
  } else {
    return FileTextIcon;
  }
};

const getProgressClass = (progress: number) => {
  if (progress >= 100) return 'complete';
  if (progress >= 50) return 'halfway';
  return 'started';
};

const handleClick = () => {
  if (isFolder.value) {
    toggle();
  } 
  // Always select the node when clicked
  emit('select', props.node.id);
};

const handleDoubleClick = () => {
  if (isFolder.value) {
    toggle();
  } else {
    emit('select', props.node.id);
  }
};

const toggle = () => {
  if (isFolder.value) {
    emit('toggle', [props.node.id, !props.node.expanded]);
  }
};

const handleExpand = (e: KeyboardEvent) => {
  if (isFolder.value && !props.node.expanded) {
    e.preventDefault();
    toggle();
  }
};

const handleCollapse = (e: KeyboardEvent) => {
  if (isFolder.value && props.node.expanded) {
    e.preventDefault();
    toggle();
  }
};

// Emit events
const emit = defineEmits<{
  (e: 'select', id: string): void
  (e: 'toggle', payload: [string, boolean]): void
}>();
</script>

<style scoped>
.file-system-node {
  position: relative;
  list-style: none;
}

.node-content {
  display: flex;
  align-items: center;
  padding: 2px 8px 2px 0;
  border-radius: 2px;
  height: 22px;
  cursor: pointer;
  user-select: none;
  margin-left: v-bind('`${props.indentLevel * 16}px`');
  position: relative;
}

.node-content:hover {
  background-color: var(--node-hover-bg, #2a2a2a);
}

.node-content.selected {
  background-color: var(--node-selected-bg, #37373d);
}

.node-content:focus {
  outline: none;
}

.node-content:focus-visible {
  outline: 1px solid var(--node-focus-outline, #007fd4);
  outline-offset: -1px;
}

.toggle-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 22px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  color: var(--node-icon-color, #c5c5c5);
}

.toggle-spacer {
  width: 16px;
  height: 22px;
}

.chevron-icon {
  width: 14px;
  height: 14px;
  transition: transform 0.1s ease;
}

.is-expanded > .node-content .chevron-icon {
  transform: rotate(0deg);
}

.node-icon {
  width: 16px;
  height: 16px;
  margin-right: 6px;
}

.folder-icon {
  color: var(--folder-icon-color, #e3a700);
}

.badge-icon {
  color: var(--badge-icon-color, #388bfd);
}

.file-icon {
  color: var(--file-icon-color, #c5c5c5);
}

.image-icon {
  color: var(--image-icon-color, #73c991);
}

.node-name {
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--node-text-color, #d4d4d4);
}

.progress-indicator {
  margin-left: auto;
  width: 30px;
}

.progress-bar {
  height: 4px;
  background-color: var(--progress-bg, #3a3a3a);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 2px;
}

.progress-fill.started {
  background-color: var(--progress-started, #3b82f6);
}

.progress-fill.halfway {
  background-color: var(--progress-halfway, #3b82f6);
}

.progress-fill.complete {
  background-color: var(--progress-complete, #22c55e);
}

.children-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>