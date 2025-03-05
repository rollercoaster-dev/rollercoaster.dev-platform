<template>
  <div class="fixed inset-0 flex items-center justify-center z-[1000] modal-overlay" @click="$emit('close')">
    <div class="w-[90%] max-w-[400px] rounded-lg modal-content delete-modal" @click.stop>
      <div class="flex justify-between items-center p-4 modal-header">
        <h2 class="m-0 text-lg font-semibold">Delete Badge</h2>
        <button class="flex items-center justify-center p-1 rounded close-button" @click="$emit('close')" aria-label="Close modal">
          <XIcon class="w-4 h-4" />
        </button>
      </div>
      
      <div class="p-4 text-center flex flex-col items-center gap-3">
        <AlertTriangleIcon class="w-8 h-8 delete-icon" />
        <p>Are you sure you want to delete <strong>{{ badgeName }}</strong>?</p>
        <p class="text-sm mt-2 delete-warning">This action cannot be undone.</p>
      </div>
      
      <div class="flex justify-end gap-3 p-4 modal-footer">
        <button type="button" @click="$emit('close')" class="px-4 py-2 text-sm rounded cancel-button">Cancel</button>
        <button 
          type="button" 
          @click="$emit('confirm')" 
          class="px-4 py-2 text-sm rounded flex items-center gap-1.5 delete-button" 
          :disabled="isDeleting"
        >
          <LoaderIcon v-if="isDeleting" class="w-4 h-4 animate-spin" />
          <span v-else>Delete</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X as XIcon, AlertTriangle as AlertTriangleIcon, Loader as LoaderIcon } from 'lucide-vue-next'

interface Props {
  badgeName: string
  isDeleting?: boolean
}

defineProps<Props>()

defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
}>()
</script>

<style scoped>
.modal-overlay {
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: var(--vscode-bg-light);
  border: 1px solid var(--vscode-border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.modal-header {
  border-bottom: 1px solid var(--vscode-border);
}

.close-button {
  background: transparent;
  border: none;
  color: var(--vscode-fg-subtle);
  cursor: pointer;
}

.close-button:hover {
  background-color: var(--vscode-hover);
  color: var(--vscode-fg);
}

.delete-icon {
  color: var(--vscode-warning);
}

.delete-warning {
  color: var(--vscode-error);
}

.modal-footer {
  border-top: 1px solid var(--vscode-border);
}

.cancel-button {
  background-color: transparent;
  border: 1px solid var(--vscode-border);
  color: var(--vscode-fg);
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-button:hover {
  background-color: var(--vscode-hover);
}

.delete-button {
  background-color: var(--vscode-error);
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.delete-button:hover:not(:disabled) {
  background-color: #d13838;
}

.delete-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Light theme overrides */
:deep(.light-theme) {
  .modal-content {
    background-color: var(--vscode-bg-light);
    border: 1px solid var(--vscode-border);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .modal-header {
    border-bottom: 1px solid var(--vscode-border);
  }

  .close-button {
    color: var(--vscode-fg-subtle);
  }

  .close-button:hover {
    background-color: var(--vscode-hover);
    color: var(--vscode-fg);
  }

  .modal-footer {
    border-top: 1px solid var(--vscode-border);
  }

  .cancel-button {
    border: 1px solid var(--vscode-border);
    color: var(--vscode-fg);
  }

  .cancel-button:hover {
    background-color: var(--vscode-hover);
  }
}
</style> 