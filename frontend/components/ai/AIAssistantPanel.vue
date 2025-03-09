<script setup lang="ts">
import { ref, reactive, h } from 'vue';
import type { Message } from '../../types/badge';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  isCollapsed?: boolean;
  selectedBadgeId?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  isCollapsed: false,
  selectedBadgeId: null
});

const emit = defineEmits<{
  (e: 'toggle', isCollapsed: boolean): void;
  (e: 'send-message', content: string, badgeId?: string): void;
  (e: 'clear-chat'): void;
}>();

// State
const isLoading = ref(false);
const messages = ref<Message[]>([]);

// Icons
const MinimizeIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '16',
  height: '16',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  class: 'icon'
}, [
  h('polyline', { points: '4 14 10 14 10 20' }),
  h('polyline', { points: '20 10 14 10 14 4' }),
  h('line', { x1: '14', y1: '10', x2: '21', y2: '3' }),
  h('line', { x1: '3', y1: '21', x2: '10', y2: '14' })
]);

const MaximizeIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '16',
  height: '16',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
  class: 'icon'
}, [
  h('polyline', { points: '15 3 21 3 21 9' }),
  h('polyline', { points: '9 21 3 21 3 15' }),
  h('line', { x1: '21', y1: '3', x2: '14', y2: '10' }),
  h('line', { x1: '3', y1: '21', x2: '10', y2: '14' })
]);

// Methods
const togglePanel = () => {
  emit('toggle', !props.isCollapsed);
};

const handleSendMessage = (content: string, badgeId?: string) => {
  // Add user message to chat
  const userMessage: Message = {
    id: uuidv4(),
    sender: 'user',
    content,
    timestamp: new Date(),
    relatedBadgeId: badgeId
  };
  
  messages.value.push(userMessage);
  
  // Simulate loading state
  isLoading.value = true;
  
  // Pass to parent for actual processing
  emit('send-message', content, badgeId);
  
  // This would be handled by the parent in a real implementation
  // For now, just simulate an AI response after a delay
  setTimeout(() => {
    const aiMessage: Message = {
      id: uuidv4(),
      sender: 'ai',
      content: `I received your message: "${content}". In a real implementation, this would be processed by an AI backend.`,
      timestamp: new Date(),
      relatedBadgeId: badgeId
    };
    
    messages.value.push(aiMessage);
    isLoading.value = false;
  }, 1500);
};

const handleClearChat = () => {
  messages.value = [];
  emit('clear-chat');
};
</script>

<template>
  <div class="ai-assistant">
    <!-- Assistant Header -->
    <div class="assistant-header">
      <span>AI ASSISTANT</span>
      <div class="assistant-actions">
        <button
          class="action-button"
          @click="togglePanel"
          :aria-label="isCollapsed ? 'Expand AI panel' : 'Collapse AI panel'"
        >
          <MinimizeIcon v-if="!isCollapsed" />
          <MaximizeIcon v-else />
        </button>
      </div>
    </div>
    
    <!-- Assistant Content -->
    <div v-if="!isCollapsed" class="assistant-content">
      <!-- Chat History -->
      <ChatHistory
        :messages="messages"
        :is-loading="isLoading"
        :selected-badge-id="selectedBadgeId"
        @send="handleSendMessage"
        @clear="handleClearChat"
      />
    </div>
    
    <!-- Collapsed State (collapsed indicator) -->
    <div v-else class="collapsed-indicator">
      <div class="rotated-text">
        AI ASSISTANT
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai-assistant {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--ai-bg);
  color: var(--ai-text);
}

.assistant-header {
  padding: 8px 12px;
  font-size: 0.8rem;
  font-weight: 500;
  border-bottom: 1px solid var(--explorer-border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.assistant-actions {
  display: flex;
  gap: 4px;
}

.action-button {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  padding: 2px;
  border-radius: 3px;
  color: var(--ai-icon-color);
}

.action-button:hover {
  background-color: var(--ai-hover-bg);
  color: var(--ai-hover-color);
}

.assistant-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.collapsed-indicator {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-left: 1px solid var(--explorer-border-color);
}

.rotated-text {
  transform: rotate(90deg);
  white-space: nowrap;
  font-size: 0.7rem;
  letter-spacing: 1px;
  opacity: 0.7;
}
</style>