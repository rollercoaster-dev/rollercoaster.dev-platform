<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Message } from '../../types/badge';

interface Props {
  message: Message;
  isLastMessage?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLastMessage: false
});

// Computed properties
const isUserMessage = computed(() => props.message.sender === 'user');
const messageClasses = computed(() => ({
  'user-message': isUserMessage.value,
  'ai-message': !isUserMessage.value,
  'last-message': props.isLastMessage
}));

// Format timestamp
const formattedTime = computed(() => {
  const date = new Date(props.message.timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
});

// Handle message content with markdown
const messageContent = computed(() => {
  // For a real implementation, you would process markdown here
  return props.message.content;
});

// Animation for typing effect (for AI messages)
const isTyping = ref(false);
const typingDots = ref('...');

// If this is the last message and it's from AI, show typing animation
if (props.isLastMessage && !isUserMessage.value) {
  isTyping.value = true;
  
  // Simulate typing dots animation
  const typingInterval = setInterval(() => {
    if (typingDots.value === '...') {
      typingDots.value = '.';
    } else if (typingDots.value === '.') {
      typingDots.value = '..';
    } else {
      typingDots.value = '...';
    }
  }, 500);
  
  // Clean up interval
  setTimeout(() => {
    clearInterval(typingInterval);
    isTyping.value = false;
  }, 2000);
}
</script>

<template>
  <div 
    class="chat-message" 
    :class="messageClasses"
  >
    <div class="message-container">
      <!-- Message content -->
      <div class="message-content">
        <template v-if="isTyping">
          <span class="typing-indicator">{{ typingDots }}</span>
        </template>
        <template v-else>
          {{ messageContent }}
        </template>
      </div>
      
      <!-- Message metadata -->
      <div class="message-meta">
        <span class="message-sender">{{ isUserMessage ? 'You' : 'Assistant' }}</span>
        <span class="message-time">{{ formattedTime }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-message {
  display: flex;
  margin-bottom: 8px;
  animation: fadeIn 0.3s ease;
}

.message-container {
  padding: 8px 12px;
  border-radius: 8px;
  max-width: 85%;
}

.user-message {
  justify-content: flex-end;
}

.user-message .message-container {
  background-color: var(--ai-user-msg-bg);
  color: var(--ai-user-msg-text);
  border-top-right-radius: 2px;
}

.ai-message .message-container {
  background-color: var(--ai-msg-bg);
  color: var(--ai-msg-text);
  border-top-left-radius: 2px;
}

.message-content {
  font-size: 0.9rem;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
}

.message-meta {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  font-size: 0.7rem;
  opacity: 0.8;
}

.typing-indicator {
  display: inline-block;
  min-width: 16px;
}

.last-message {
  margin-bottom: 16px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>