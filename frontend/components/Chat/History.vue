<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import type { Message } from '../../types/badge';

interface Props {
  messages: Message[];
  isLoading?: boolean;
  selectedBadgeId?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  selectedBadgeId: null
});

const emit = defineEmits<{
  (e: 'send', content: string, badgeId?: string): void;
  (e: 'clear'): void;
}>();

// Template refs
const messagesContainer = ref<HTMLElement | null>(null);

// Suggestions for empty state
const suggestions = [
  'Tell me about this badge',
  'What should I learn next?',
  'How can I improve my progress?',
  'Generate requirements for this badge'
];

// Methods
const sendMessage = (content: string) => {
  emit('send', content, props.selectedBadgeId || undefined);
};

const clearChat = () => {
  emit('clear');
};

const sendSuggestion = (suggestion: string) => {
  sendMessage(suggestion);
};

// Scroll to bottom of chat when new messages arrive
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

// Watch for new messages and scroll to bottom
watch(() => props.messages.length, () => {
  scrollToBottom();
});

// Initialize
onMounted(() => {
  scrollToBottom();
});
</script>

<template>
  <div class="chat-history">
    <!-- Message History -->
    <div ref="messagesContainer" class="messages-container">
      <!-- Empty State -->
      <template v-if="messages.length === 0">
        <div class="empty-messages">
          <p class="welcome-message">
            How can I help you with your badges today?
          </p>
          <div class="suggestion-buttons">
            <button 
              v-for="(suggestion, index) in suggestions" 
              :key="index"
              class="suggestion-button"
              @click="sendSuggestion(suggestion)"
              :disabled="isLoading"
            >
              {{ suggestion }}
            </button>
          </div>
        </div>
      </template>
      
      <!-- Message List -->
      <template v-else>
        <ChatMessage
          v-for="(message, index) in messages"
          :key="message.id"
          :message="message"
          :is-last-message="index === messages.length - 1"
        />
      </template>
    </div>
    
    <!-- Input Area -->
    <div class="chat-input-wrapper">
      <ChatInput
        :disabled="isLoading"
        :placeholder="isLoading ? 'Processing...' : 'Type a message...'"
        @send="sendMessage"
        @clear="clearChat"
      />
    </div>
  </div>
</template>

<style scoped>
.chat-history {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--ai-bg);
  color: var(--ai-text);
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: var(--ai-scrollbar-thumb) var(--ai-scrollbar-track);
}

.messages-container::-webkit-scrollbar {
  width: 6px;
}

.messages-container::-webkit-scrollbar-track {
  background: var(--ai-scrollbar-track);
}

.messages-container::-webkit-scrollbar-thumb {
  background-color: var(--ai-scrollbar-thumb);
  border-radius: 3px;
}

.empty-messages {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 16px;
  text-align: center;
}

.welcome-message {
  font-size: 1rem;
  color: var(--ai-welcome-text);
  margin-bottom: 24px;
}

.suggestion-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 300px;
}

.suggestion-button {
  padding: 8px 12px;
  background-color: var(--ai-suggestion-bg);
  color: var(--ai-suggestion-text);
  border: 1px solid var(--ai-suggestion-border);
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s;
}

.suggestion-button:hover {
  background-color: var(--ai-suggestion-hover-bg);
}

.chat-input-wrapper {
  padding: 0;
  border-top: 1px solid var(--explorer-border-color);
}
</style>