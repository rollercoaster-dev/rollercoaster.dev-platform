<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';

interface Props {
  placeholder?: string;
  disabled?: boolean;
  maxRows?: number;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Type a message...',
  disabled: false,
  maxRows: 5
});

const emit = defineEmits<{
  (e: 'send', message: string): void;
  (e: 'clear'): void;
}>();

// State
const message = ref('');
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const isInputFocused = ref(false);

// Methods
const sendMessage = () => {
  if (!message.value.trim() || props.disabled) return;
  
  emit('send', message.value.trim());
  message.value = '';
  
  // Auto-focus input after sending
  nextTick(() => {
    textareaRef.value?.focus();
  });
};

const adjustTextareaHeight = () => {
  const textarea = textareaRef.value;
  if (!textarea) return;
  
  // Reset height to auto to allow shrinking
  textarea.style.height = 'auto';
  
  // Calculate new height but keep within maxRows limit
  const scrollHeight = textarea.scrollHeight;
  const lineHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20;
  const maxHeight = props.maxRows * lineHeight;
  
  textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
};

const handleFocus = () => {
  isInputFocused.value = true;
};

const handleBlur = () => {
  isInputFocused.value = false;
};

const clearInput = () => {
  message.value = '';
  emit('clear');
  textareaRef.value?.focus();
};

// Initialize
onMounted(() => {
  adjustTextareaHeight();
});
</script>

<template>
  <div 
    class="chat-input-container"
    :class="{ 'focused': isInputFocused, 'disabled': disabled }"
  >
    <textarea
      ref="textareaRef"
      v-model="message"
      class="chat-input"
      :placeholder="placeholder"
      rows="1"
      :disabled="disabled"
      @keydown="handleKeydown"
      @input="adjustTextareaHeight"
      @focus="handleFocus"
      @blur="handleBlur"
    ></textarea>
    
    <div class="input-actions">
      <button 
        v-if="message.trim().length > 0"
        class="clear-button action-button"
        @click="clearInput"
        :disabled="disabled"
        aria-label="Clear message"
      >
        <span class="material-icons">close</span>
      </button>
      
      <button 
        class="send-button action-button"
        @click="sendMessage"
        :disabled="disabled || !message.trim()"
        aria-label="Send message"
      >
        <span class="material-icons">send</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-input-container {
  background-color: var(--ai-input-bg);
  border-top: 1px solid var(--explorer-border-color);
  padding: 10px 12px;
  border-radius: 0 0 6px 6px;
  display: flex;
  position: relative;
}

.chat-input {
  flex: 1;
  padding: 8px 12px;
  background-color: var(--ai-textarea-bg);
  color: var(--ai-textarea-text);
  border: 1px solid var(--ai-textarea-border);
  border-radius: 6px;
  font-size: 0.9rem;
  line-height: 1.4;
  resize: none;
  overflow-y: auto;
  max-height: 150px;
  transition: border-color 0.2s;
  margin-right: 8px;
}

.chat-input:focus {
  outline: none;
  border-color: var(--ai-textarea-focus);
}

.chat-input::placeholder {
  color: var(--explorer-subtle-color);
}

.input-actions {
  display: flex;
  align-items: flex-end;
  gap: 4px;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.clear-button {
  color: var(--ai-clear-button);
}

.clear-button:hover {
  background-color: var(--ai-clear-hover);
}

.send-button {
  color: var(--ai-send-button);
}

.send-button:hover {
  background-color: var(--ai-send-hover);
}

.action-button .material-icons {
  font-size: 20px;
}

.focused {
  border-color: var(--ai-textarea-focus);
}

.disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.disabled .chat-input {
  cursor: not-allowed;
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