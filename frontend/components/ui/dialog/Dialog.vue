<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="open" 
        class="dialog-backdrop"
        @click="handleBackdropClick"
        aria-hidden="true"
      ></div>
    </Transition>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div 
        v-if="open" 
        class="dialog-container"
        role="dialog"
        aria-modal="true"
        ref="dialogRef"
        :aria-labelledby="ariaLabelledby"
        :aria-describedby="ariaDescribedby"
      >
        <div class="dialog-content">
          <div class="dialog-close-button-container">
            <button 
              class="dialog-close-button"
              @click="closeDialog"
              aria-label="Close dialog"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <slot></slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

interface Props {
  open: boolean;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
  closeOnBackdropClick?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  ariaLabelledby: undefined,
  ariaDescribedby: undefined,
  closeOnBackdropClick: true
});

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void;
  (e: 'close'): void;
}>();

const dialogRef = ref<HTMLElement | null>(null);
const previouslyFocusedElement = ref<HTMLElement | null>(null);

// Close dialog
const closeDialog = () => {
  emit('update:open', false);
  emit('close');
};

// Handle backdrop click
const handleBackdropClick = () => {
  if (props.closeOnBackdropClick) {
    closeDialog();
  }
};

// Handle ESC key press
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.open) {
    closeDialog();
  }
};

// Trap focus inside dialog
const handleTabKey = (event: KeyboardEvent) => {
  if (!dialogRef.value || event.key !== 'Tab') return;

  const focusableElements = dialogRef.value.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  // If going backward (shift+tab) and on first element, go to last element
  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
    // If going forward (tab) and on last element, go to first element
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
};

// Add and remove event listeners
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyDown);
});

// Focus management when dialog opens/closes
watch(() => props.open, (newValue) => {
  if (newValue) {
    // Store currently focused element
    previouslyFocusedElement.value = document.activeElement as HTMLElement;
    
    // Add the tab key trap
    document.addEventListener('keydown', handleTabKey);
    
    // Focus the first focusable element in the dialog
    setTimeout(() => {
      if (dialogRef.value) {
        const firstFocusable = dialogRef.value.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement;
        
        if (firstFocusable) {
          firstFocusable.focus();
        } else {
          // If no focusable element, focus the dialog itself
          dialogRef.value.setAttribute('tabindex', '-1');
          dialogRef.value.focus();
        }
      }
    }, 50);
  } else {
    // Remove the tab key trap
    document.removeEventListener('keydown', handleTabKey);
    
    // Return focus to previously focused element
    if (previouslyFocusedElement.value) {
      previouslyFocusedElement.value.focus();
    }
  }
});
</script>

<style scoped>
.dialog-backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 50;
}

.dialog-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 51;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
}

.dialog-content {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
}

.dialog-close-button-container {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 1;
}

.dialog-close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background-color: transparent;
  color: #64748b;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dialog-close-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.dialog-close-button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.dialog-close-button svg {
  width: 1rem;
  height: 1rem;
}
</style>