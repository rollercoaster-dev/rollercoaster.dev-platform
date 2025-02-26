<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { 
  FileText, 
  FolderOpen, 
  Award, 
  ChevronDown, 
  ChevronRight, 
  X, 
  Maximize2, 
  Minimize2, 
  MessageSquare, 
  Clock, 
  Plus, 
  Search, 
  Settings, 
  User, 
  Save,
  Code,
  Image,
  FileImage,
  Bookmark,
  CheckCircle2
} from 'lucide-vue-next'

// Types
type BadgeProject = {
  id: string
  name: string
  type: 'folder' | 'badge' | 'file' | 'image'
  children?: BadgeProject[]
  expanded?: boolean
  progress?: number
  content?: string
}

type Message = {
  id: string
  sender: 'user' | 'ai'
  content: string
  timestamp: Date
}

// State
const showBadgeProgress = ref(true)
const showAIPanel = ref(true)
const activeFile = ref<BadgeProject | null>(null)
const userInput = ref('')
const aiInput = ref('')
const messages = ref<Message[]>([
  {
    id: '1',
    sender: 'ai',
    content: 'Hello! I can help you create badges, set learning goals, or discuss your progress. What would you like to do today?',
    timestamp: new Date()
  }
])

// File system data
const projects = reactive<BadgeProject[]>([
  {
    id: '1',
    name: 'Web Development',
    type: 'folder',
    expanded: true,
    children: [
      {
        id: '1-1',
        name: 'JavaScript Mastery',
        type: 'badge',
        progress: 65,
        content: '# JavaScript Mastery Badge\n\nThis badge represents proficiency in JavaScript programming.\n\n## Requirements\n\n- Complete 3 JavaScript projects\n- Learn ES6+ features\n- Understand async programming'
      },
      {
        id: '1-2',
        name: 'CSS Animations',
        type: 'badge',
        progress: 30,
        content: '# CSS Animations Badge\n\nThis badge represents skill in creating CSS animations.\n\n## Requirements\n\n- Create 5 different animation types\n- Learn keyframes\n- Build a portfolio with animations'
      },
      {
        id: '1-3',
        name: 'learning-notes.md',
        type: 'file',
        content: '# Web Development Learning Notes\n\n## JavaScript\n- Learned about closures\n- Practiced async/await\n- Implemented event delegation\n\n## CSS\n- Flexbox layouts\n- Grid systems\n- Animation techniques'
      }
    ]
  },
  {
    id: '2',
    name: 'Data Science',
    type: 'folder',
    expanded: false,
    children: [
      {
        id: '2-1',
        name: 'Python Basics',
        type: 'badge',
        progress: 90,
        content: '# Python Basics Badge\n\nThis badge represents foundational knowledge of Python.\n\n## Requirements\n\n- Understand Python syntax\n- Create basic programs\n- Work with libraries'
      },
      {
        id: '2-2',
        name: 'dataset-analysis.png',
        type: 'image'
      }
    ]
  },
  {
    id: '3',
    name: 'Personal Goals',
    type: 'folder',
    expanded: false,
    children: [
      {
        id: '3-1',
        name: 'Reading Challenge',
        type: 'badge',
        progress: 45,
        content: '# Reading Challenge Badge\n\nThis badge represents commitment to reading regularly.\n\n## Requirements\n\n- Read 12 books in a year\n- Write summaries\n- Discuss with others'
      }
    ]
  }
])

// Methods
const toggleFolder = (folder: BadgeProject) => {
  if (folder.type === 'folder') {
    folder.expanded = !folder.expanded
  }
}

const openFile = (file: BadgeProject) => {
  if (file.type !== 'folder') {
    activeFile.value = file
  }
}

const toggleBadgeProgress = () => {
  showBadgeProgress.value = !showBadgeProgress.value
}

const toggleAIPanel = () => {
  showAIPanel.value = !showAIPanel.value
}

const sendMessage = () => {
  if (!aiInput.value.trim()) return
  
  messages.value.push({
    id: Date.now().toString(),
    sender: 'user',
    content: aiInput.value,
    timestamp: new Date()
  })
  
  // Simulate AI response
  setTimeout(() => {
    messages.value.push({
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      content: `I'll help you with "${aiInput.value}". What specific aspects would you like to focus on?`,
      timestamp: new Date()
    })
  }, 1000)
  
  aiInput.value = ''
}

const updateBadgeProgress = (badge: BadgeProject, newProgress: number) => {
  if (badge.type === 'badge' && badge.progress !== undefined) {
    badge.progress = Math.min(100, Math.max(0, newProgress))
  }
}

const getFileIcon = (file: BadgeProject) => {
  switch (file.type) {
    case 'folder': return FolderOpen
    case 'badge': return Award
    case 'image': return FileImage
    default: return FileText
  }
}

// Computed
const formattedDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

// Lifecycle
onMounted(() => {
  // Set initial active file
  if (projects[0]?.children?.[0]) {
    activeFile.value = projects[0].children[0]
  }
})
</script>

<template>
  <div class="vs-code-app flex h-screen bg-[#1e1e1e] text-[#d4d4d4] overflow-hidden">
    <!-- Left Sidebar: File Explorer -->
    <div class="sidebar w-64 flex flex-col border-r border-[#333333]">
      <div class="sidebar-header p-2 text-sm font-medium border-b border-[#333333]">
        <div class="flex items-center justify-between">
          <span>EXPLORER</span>
          <button class="p-1 hover:bg-[#2a2a2a] rounded">
            <Plus class="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div class="sidebar-content flex-1 overflow-y-auto">
        <div class="p-1">
          <!-- Projects/Badges Tree View -->
          <div v-for="project in projects" :key="project.id" class="mb-1">
            <div 
              @click="toggleFolder(project)" 
              class="flex items-center p-1 hover:bg-[#2a2a2a] cursor-pointer rounded"
            >
              <component :is="project.expanded ? ChevronDown : ChevronRight" class="w-4 h-4 mr-1" />
              <component :is="getFileIcon(project)" class="w-4 h-4 mr-2" />
              <span>{{ project.name }}</span>
            </div>
            
            <!-- Children -->
            <div v-if="project.expanded && project.children" class="ml-4">
              <div 
                v-for="child in project.children" 
                :key="child.id"
                @click="openFile(child)"
                class="flex items-center p-1 hover:bg-[#2a2a2a] cursor-pointer rounded"
                :class="{'bg-[#37373d]': activeFile?.id === child.id}"
              >
                <component :is="getFileIcon(child)" class="w-4 h-4 mr-2" />
                <span>{{ child.name }}</span>
                <div v-if="child.type === 'badge' && child.progress !== undefined" class="ml-auto">
                  <div class="w-8 h-1 bg-[#3a3a3a] rounded-full overflow-hidden">
                    <div 
                      class="h-full bg-[#0e639c]" 
                      :style="{width: `${child.progress}%`}"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Sidebar Footer -->
      <div class="sidebar-footer border-t border-[#333333] p-2">
        <div class="flex items-center justify-between">
          <button class="p-1 hover:bg-[#2a2a2a] rounded">
            <Settings class="w-4 h-4" />
          </button>
          <button class="p-1 hover:bg-[#2a2a2a] rounded">
            <User class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- Main Area: Editor + Badge Progress -->
    <div class="main-area flex-1 flex flex-col">
      <!-- Tabs -->
      <div class="tabs flex border-b border-[#333333]">
        <div 
          v-if="activeFile"
          class="tab flex items-center px-3 py-1 bg-[#2d2d2d] border-r border-[#333333]"
        >
          <component :is="getFileIcon(activeFile)" class="w-4 h-4 mr-2" />
          <span>{{ activeFile.name }}</span>
          <button class="ml-2 p-1 hover:bg-[#3a3a3a] rounded">
            <X class="w-3 h-3" />
          </button>
        </div>
      </div>
      
      <!-- Editor Content -->
      <div class="editor-container flex-1 flex overflow-hidden">
        <!-- Text Editor -->
        <div class="editor flex-1 overflow-y-auto p-4">
          <div v-if="activeFile?.type === 'badge'" class="mb-4">
            <h1 class="text-xl font-bold mb-2">{{ activeFile.name }}</h1>
            <div class="flex items-center mb-4">
              <span class="mr-2">Progress:</span>
              <div class="w-48 h-2 bg-[#3a3a3a] rounded-full overflow-hidden">
                <div 
                  class="h-full bg-[#0e639c]" 
                  :style="{width: `${activeFile.progress}%`}"
                ></div>
              </div>
              <span class="ml-2">{{ activeFile.progress }}%</span>
            </div>
          </div>
          
          <textarea 
            v-if="activeFile && activeFile.type !== 'image'"
            v-model="activeFile.content"
            class="w-full h-[calc(100%-60px)] bg-[#1e1e1e] text-[#d4d4d4] border border-[#333333] p-2 rounded font-mono resize-none focus:outline-none focus:border-[#0e639c]"
          ></textarea>
          
          <div v-else-if="activeFile?.type === 'image'" class="flex items-center justify-center h-[calc(100%-60px)]">
            <div class="bg-[#2d2d2d] p-4 rounded">
              <FileImage class="w-32 h-32 mx-auto text-[#0e639c]" />
              <p class="text-center mt-2">{{ activeFile.name }}</p>
            </div>
          </div>
          
          <div v-else class="flex items-center justify-center h-full text-[#6a6a6a]">
            <p>No file selected</p>
          </div>
        </div>
        
        <!-- Badge Progress Panel -->
        <div 
          v-if="showBadgeProgress && activeFile?.type === 'badge'" 
          class="badge-progress w-64 border-l border-[#333333] overflow-y-auto"
        >
          <div class="flex items-center justify-between p-2 border-b border-[#333333]">
            <span class="font-medium">Badge Progress</span>
            <button @click="toggleBadgeProgress" class="p-1 hover:bg-[#2a2a2a] rounded">
              <X class="w-4 h-4" />
            </button>
          </div>
          
          <div class="p-3">
            <div class="mb-4">
              <p class="text-sm mb-1">Current Progress: {{ activeFile.progress }}%</p>
              <input 
                type="range" 
                :value="activeFile.progress" 
                @input="updateBadgeProgress(activeFile, parseInt($event.target.value))" 
                min="0" 
                max="100" 
                class="w-full"
              />
            </div>
            
            <div class="mb-4">
              <h3 class="text-sm font-medium mb-2">Requirements</h3>
              <div class="space-y-2">
                <div class="flex items-start">
                  <CheckCircle2 class="w-4 h-4 mr-2 mt-0.5 text-[#0e639c]" />
                  <span class="text-sm">Requirement 1</span>
                </div>
                <div class="flex items-start">
                  <CheckCircle2 class="w-4 h-4 mr-2 mt-0.5 text-[#6a6a6a]" />
                  <span class="text-sm">Requirement 2</span>
                </div>
                <div class="flex items-start">
                  <CheckCircle2 class="w-4 h-4 mr-2 mt-0.5 text-[#6a6a6a]" />
                  <span class="text-sm">Requirement 3</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 class="text-sm font-medium mb-2">Timeline</h3>
              <p class="text-xs text-[#6a6a6a]">Started: January 15, 2025</p>
              <p class="text-xs text-[#6a6a6a]">Target: March 30, 2025</p>
              <p class="text-xs mt-2">Today: {{ formattedDate }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Status Bar -->
      <div class="status-bar flex items-center justify-between px-3 py-1 bg-[#007acc] text-white text-xs">
        <div class="flex items-center">
          <span>{{ activeFile?.name || 'No file' }}</span>
        </div>
        <div class="flex items-center">
          <button class="px-2 py-0.5 hover:bg-[#1f8ad2]">
            <Save class="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- Right Panel: AI Agent -->
    <div 
      v-if="showAIPanel" 
      class="ai-panel w-80 flex flex-col border-l border-[#333333]"
    >
      <div class="ai-header flex items-center justify-between p-2 border-b border-[#333333]">
        <span class="font-medium">AI Assistant</span>
        <button @click="toggleAIPanel" class="p-1 hover:bg-[#2a2a2a] rounded">
          <X class="w-4 h-4" />
        </button>
      </div>
      
      <div class="ai-tabs flex border-b border-[#333333]">
        <button class="px-3 py-1 bg-[#2d2d2d] border-r border-[#333333] flex items-center">
          <MessageSquare class="w-3 h-3 mr-1" />
          <span class="text-xs">Chat</span>
        </button>
        <button class="px-3 py-1 border-r border-[#333333] flex items-center">
          <Clock class="w-3 h-3 mr-1" />
          <span class="text-xs">Timer</span>
        </button>
      </div>
      
      <div class="ai-content flex-1 flex flex-col overflow-hidden">
        <!-- Chat Messages -->
        <div class="messages flex-1 overflow-y-auto p-3 space-y-4">
          <div 
            v-for="message in messages" 
            :key="message.id"
            class="message flex"
            :class="{'justify-end': message.sender === 'user'}"
          >
            <div 
              class="max-w-[80%] p-2 rounded"
              :class="{
                'bg-[#2d2d2d]': message.sender === 'ai',
                'bg-[#0e639c]': message.sender === 'user'
              }"
            >
              <p class="text-sm">{{ message.content }}</p>
              <p class="text-xs text-[#6a6a6a] mt-1">
                {{ message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}
              </p>
            </div>
          </div>
        </div>
        
        <!-- Input Area -->
        <div class="input-area p-3 border-t border-[#333333]">
          <div class="flex items-center">
            <input 
              v-model="aiInput"
              @keyup.enter="sendMessage"
              type="text" 
              placeholder="Ask the AI assistant..." 
              class="flex-1 bg-[#3a3a3a] text-[#d4d4d4] border border-[#555555] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#0e639c]"
            />
            <button 
              @click="sendMessage"
              class="ml-2 p-2 bg-[#0e639c] rounded hover:bg-[#1177bb]"
            >
              <MessageSquare class="w-4 h-4" />
            </button>
          </div>
          
          <div class="mt-2 flex flex-wrap gap-1">
            <button class="px-2 py-1 bg-[#2d2d2d] text-xs rounded hover:bg-[#3a3a3a]">
              Create Badge
            </button>
            <button class="px-2 py-1 bg-[#2d2d2d] text-xs rounded hover:bg-[#3a3a3a]">
              Set Timer
            </button>
            <button class="px-2 py-1 bg-[#2d2d2d] text-xs rounded hover:bg-[#3a3a3a]">
              Summarize
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #1e1e1e;
}

::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #666;
}

/* Range input styling */
input[type="range"] {
  -webkit-appearance: none;
  height: 4px;
  background: #3a3a3a;
  border-radius: 2px;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: #0e639c;
  border-radius: 50%;
  cursor: pointer;
}
</style>