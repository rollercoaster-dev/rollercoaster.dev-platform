<template>
  <div 
    class="vs-code-app flex h-screen overflow-hidden"
    :class="{ 'dark': isDarkMode }"
  >
    <!-- Left Sidebar: File Explorer -->
    <div 
      class="sidebar border-r border-[#333333] flex flex-col"
      :class="{ 'collapsed': isLeftSidebarCollapsed }"
      :style="{ width: isLeftSidebarCollapsed ? '50px' : `${leftSidebarWidth}px` }"
    >
      <div class="sidebar-toggle flex justify-end p-1">
        <button 
          @click="toggleLeftSidebar" 
          class="p-1 hover:bg-[#2a2a2a] rounded text-[#6a6a6a] hover:text-[#d4d4d4]"
        >
          <ChevronLeftIcon v-if="!isLeftSidebarCollapsed" class="w-4 h-4" />
          <ChevronRightIcon v-else class="w-4 h-4" />
        </button>
      </div>
      
      <slot name="left-sidebar"></slot>
    </div>
    
    <!-- Main Content -->
    <div class="main-content flex-1 flex flex-col">
      <slot name="main-content"></slot>
    </div>
    
    <!-- Right Sidebar: AI Assistant -->
    <div 
      class="ai-sidebar border-l border-[#333333] flex flex-col"
      :class="{ 'collapsed': isRightSidebarCollapsed }"
      :style="{ width: isRightSidebarCollapsed ? '50px' : `${rightSidebarWidth}px` }"
    >
      <div class="sidebar-toggle flex justify-start p-1">
        <button 
          @click="toggleRightSidebar" 
          class="p-1 hover:bg-[#2a2a2a] rounded text-[#6a6a6a] hover:text-[#d4d4d4]"
        >
          <ChevronRightIcon v-if="!isRightSidebarCollapsed" class="w-4 h-4" />
          <ChevronLeftIcon v-else class="w-4 h-4" />
        </button>
      </div>
      
      <slot name="right-sidebar"></slot>
    </div>
    
    <!-- Resizers -->
    <div 
      v-if="!isLeftSidebarCollapsed"
      class="left-resizer"
      @mousedown="startResizingLeft"
    ></div>
    
    <div 
      v-if="!isRightSidebarCollapsed"
      class="right-resizer"
      @mousedown="startResizingRight"
    ></div>
    
    <!-- Status Bar -->
    <div class="status-bar fixed bottom-0 left-0 right-0 flex items-center justify-between bg-[#007acc] text-white text-xs px-3 py-1">
      <div class="flex items-center">
        <slot name="status-left"></slot>
      </div>
      
      <div class="flex items-center">
        <button 
          @click="toggleDarkMode" 
          class="px-2 py-0.5 hover:bg-[#1f8ad2] flex items-center"
        >
          <SunIcon v-if="isDarkMode" class="w-3 h-3 mr-1" />
          <MoonIcon v-else class="w-3 h-3 mr-1" />
          <span>{{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}</span>
        </button>
        
        <slot name="status-right"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { 
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
} from 'lucide-vue-next';

// Props
interface Props {
  initialLeftSidebarWidth?: number;
  initialRightSidebarWidth?: number;
  initialLeftSidebarCollapsed?: boolean;
  initialRightSidebarCollapsed?: boolean;
  initialDarkMode?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  initialLeftSidebarWidth: 250,
  initialRightSidebarWidth: 300,
  initialLeftSidebarCollapsed: false,
  initialRightSidebarCollapsed: false,
  initialDarkMode: true
});

// State
const leftSidebarWidth = ref(props.initialLeftSidebarWidth);
const rightSidebarWidth = ref(props.initialRightSidebarWidth);
const isLeftSidebarCollapsed = ref(props.initialLeftSidebarCollapsed);
const isRightSidebarCollapsed = ref(props.initialRightSidebarCollapsed);
const isDarkMode = ref(props.initialDarkMode);

// Resizing logic
const isResizingLeft = ref(false);
const isResizingRight = ref(false);
const startResizeX = ref(0);

// Sidebar toggle functions
const toggleLeftSidebar = () => {
  isLeftSidebarCollapsed.value = !isLeftSidebarCollapsed.value;
  emit('leftSidebarToggle', isLeftSidebarCollapsed.value);
};

const toggleRightSidebar = () => {
  isRightSidebarCollapsed.value = !isRightSidebarCollapsed.value;
  emit('rightSidebarToggle', isRightSidebarCollapsed.value);
};

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  emit('darkModeToggle', isDarkMode.value);
  
  // Store preference
  localStorage.setItem('atBadges_darkMode', isDarkMode.value ? 'dark' : 'light');
};

// Resizer functions
const startResizingLeft = (e: MouseEvent) => {
  isResizingLeft.value = true;
  startResizeX.value = e.clientX;
  document.body.style.cursor = 'ew-resize';
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', stopResizing);
};

const startResizingRight = (e: MouseEvent) => {
  isResizingRight.value = true;
  startResizeX.value = e.clientX;
  document.body.style.cursor = 'ew-resize';
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', stopResizing);
};

const handleMouseMove = (e: MouseEvent) => {
  if (isResizingLeft.value) {
    const delta = e.clientX - startResizeX.value;
    leftSidebarWidth.value = Math.max(150, Math.min(500, leftSidebarWidth.value + delta));
    startResizeX.value = e.clientX;
    emit('leftSidebarResize', leftSidebarWidth.value);
  }
  
  if (isResizingRight.value) {
    const delta = startResizeX.value - e.clientX;
    rightSidebarWidth.value = Math.max(200, Math.min(600, rightSidebarWidth.value + delta));
    startResizeX.value = e.clientX;
    emit('rightSidebarResize', rightSidebarWidth.value);
  }
};

const stopResizing = () => {
  isResizingLeft.value = false;
  isResizingRight.value = false;
  document.body.style.cursor = '';
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', stopResizing);
};

// Emit events
const emit = defineEmits<{
  (e: 'leftSidebarToggle', collapsed: boolean): void
  (e: 'rightSidebarToggle', collapsed: boolean): void
  (e: 'leftSidebarResize', width: number): void
  (e: 'rightSidebarResize', width: number): void
  (e: 'darkModeToggle', isDark: boolean): void
}>();

// Lifecycle hooks
onMounted(() => {
  // Load dark mode preference
  const storedTheme = localStorage.getItem('atBadges_darkMode');
  if (storedTheme) {
    isDarkMode.value = storedTheme === 'dark';
  }
  
  // Load sidebar preferences
  const storedLeftWidth = localStorage.getItem('atBadges_leftSidebarWidth');
  if (storedLeftWidth) {
    leftSidebarWidth.value = parseInt(storedLeftWidth);
  }
  
  const storedRightWidth = localStorage.getItem('atBadges_rightSidebarWidth');
  if (storedRightWidth) {
    rightSidebarWidth.value = parseInt(storedRightWidth);
  }
  
  const storedLeftCollapsed = localStorage.getItem('atBadges_leftSidebarCollapsed');
  if (storedLeftCollapsed) {
    isLeftSidebarCollapsed.value = storedLeftCollapsed === 'true';
  }
  
  const storedRightCollapsed = localStorage.getItem('atBadges_rightSidebarCollapsed');
  if (storedRightCollapsed) {
    isRightSidebarCollapsed.value = storedRightCollapsed === 'true';
  }
});

onBeforeUnmount(() => {
  // Store preferences
  localStorage.setItem('atBadges_leftSidebarWidth', leftSidebarWidth.value.toString());
  localStorage.setItem('atBadges_rightSidebarWidth', rightSidebarWidth.value.toString());
  localStorage.setItem('atBadges_leftSidebarCollapsed', isLeftSidebarCollapsed.value.toString());
  localStorage.setItem('atBadges_rightSidebarCollapsed', isRightSidebarCollapsed.value.toString());
  
  // Clean up event listeners
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', stopResizing);
});
</script>

<style scoped>
.vs-code-app {
  background-color: #1e1e1e;
  color: #d4d4d4;
}

.vs-code-app.dark {
  background-color: #1e1e1e; 
  color: #d4d4d4;
}

.vs-code-app:not(.dark) {
  background-color: #ffffff;
  color: #333333;
}

.sidebar {
  position: relative;
  transition: width 0.2s ease;
  z-index: 10;
  background-color: inherit;
}

.sidebar.collapsed {
  overflow: hidden;
}

.main-content {
  position: relative;
  z-index: 5;
}

.ai-sidebar {
  position: relative;
  transition: width 0.2s ease;
  z-index: 10;
  background-color: inherit;
}

.ai-sidebar.collapsed {
  overflow: hidden;
}

.left-resizer {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 5px;
  background-color: transparent;
  cursor: ew-resize;
  z-index: 20;
}

.right-resizer {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 5px;
  background-color: transparent;
  cursor: ew-resize;
  z-index: 20;
}

.status-bar {
  height: 22px;
  z-index: 30;
}

/* Dark mode styles */
.dark .sidebar, .dark .ai-sidebar {
  background-color: #1e1e1e;
  border-color: #333333;
}

.dark .status-bar {
  background-color: #007acc;
  color: #ffffff;
}

:not(.dark) .sidebar, :not(.dark) .ai-sidebar {
  background-color: #f3f3f3;
  border-color: #e5e5e5;
}

:not(.dark) .status-bar {
  background-color: #007acc;
  color: #ffffff;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #666;
}

.dark ::-webkit-scrollbar-thumb {
  background: #555;
}

:not(.dark) ::-webkit-scrollbar-thumb {
  background: #bbb;
}
</style>