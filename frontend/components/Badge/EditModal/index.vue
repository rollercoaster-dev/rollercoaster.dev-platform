<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Edit Badge</h2>
        <button class="close-button" @click="$emit('close')" aria-label="Close modal">
          <XIcon class="icon" />
        </button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="badge-form">
        <div class="form-group">
          <label for="edit-badge-name">Name</label>
          <input 
            id="edit-badge-name" 
            v-model="formData.name" 
            type="text" 
            required 
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label for="edit-badge-description">Description</label>
          <textarea 
            id="edit-badge-description" 
            v-model="formData.description" 
            required 
            class="form-textarea"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label for="edit-badge-content">Additional Content (Optional)</label>
          <textarea 
            id="edit-badge-content" 
            v-model="formData.content" 
            class="form-textarea"
          ></textarea>
        </div>
        
        <div class="form-row">
          <div class="form-group half">
            <label for="edit-badge-start-date">Start Date (Optional)</label>
            <input 
              id="edit-badge-start-date" 
              v-model="formData.startDate" 
              type="date" 
              class="form-input"
            />
          </div>
          
          <div class="form-group half">
            <label for="edit-badge-target-date">Target Date (Optional)</label>
            <input 
              id="edit-badge-target-date" 
              v-model="formData.targetDate" 
              type="date" 
              class="form-input"
            />
          </div>
        </div>
        
        <BadgeRequirementsList
          :requirements="formData.requirements"
          :is-editing="true"
          @update:requirements="updateRequirements"
        />
        
        <div class="form-actions">
          <button type="button" @click="$emit('close')" class="cancel-button">Cancel</button>
          <button type="submit" class="submit-button" :disabled="isSubmitting">
            <LoaderIcon v-if="isSubmitting" class="icon spin" />
            <span v-else>Update Badge</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { X as XIcon, Loader as LoaderIcon } from 'lucide-vue-next'
import type { Badge, BadgeRequirement } from '../../../shared/types/badge'
import BadgeRequirementsList from './BadgeRequirementsList.vue'

interface Props {
  badge: Badge
  isSubmitting?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isSubmitting: false
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: Partial<Badge>): void
}>()

const formData = ref<Partial<Badge> & { requirements: BadgeRequirement[] }>({
  name: '',
  description: '',
  content: '',
  startDate: '',
  targetDate: '',
  requirements: []
})

onMounted(() => {
  // Initialize form data with badge values
  formData.value = {
    name: props.badge.name,
    description: props.badge.description,
    content: props.badge.content || '',
    startDate: props.badge.startDate || '',
    targetDate: props.badge.targetDate || '',
    requirements: props.badge.requirements?.map(req => ({
      id: req.id,
      description: req.description,
      completed: req.completed
    })) || []
  }
})

const updateRequirements = (requirements: BadgeRequirement[]) => {
  formData.value.requirements = requirements
}

const handleSubmit = () => {
  emit('submit', formData.value)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--vscode-bg-light);
  border: 1px solid var(--vscode-border);
  border-radius: 6px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--vscode-border);
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-button {
  background: transparent;
  border: none;
  color: var(--vscode-fg-subtle);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
}

.close-button:hover {
  background-color: var(--vscode-hover);
  color: var(--vscode-fg);
}

.badge-form {
  padding: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-group.half {
  flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
}

.form-input, .form-textarea {
  width: 100%;
  background-color: var(--vscode-bg-lighter);
  border: 1px solid var(--vscode-border);
  color: var(--vscode-fg);
  padding: 8px;
  border-radius: 4px;
  font-size: 13px;
  font-family: inherit;
}

.form-textarea {
  min-height: 80px;
  resize: vertical;
}

.form-input:focus, .form-textarea:focus {
  outline: 2px solid var(--vscode-focus);
  outline-offset: -1px;
  border-color: transparent;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.cancel-button {
  background-color: transparent;
  border: 1px solid var(--vscode-border);
  color: var(--vscode-fg);
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-button:hover {
  background-color: var(--vscode-hover);
}

.submit-button {
  background-color: var(--vscode-focus);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.submit-button:hover:not(:disabled) {
  background-color: #0062a3;
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.icon {
  width: 16px;
  height: 16px;
}

.spin {
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Dark mode overrides */
:deep(.badge-manager:not(.dark)) {
  .modal-content {
    background-color: var(--vscode-light-bg-light);
    border: 1px solid var(--vscode-light-border);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .modal-header {
    border-bottom: 1px solid var(--vscode-light-border);
  }

  .close-button {
    color: var(--vscode-light-fg-subtle);
  }

  .close-button:hover {
    background-color: var(--vscode-light-hover);
    color: var(--vscode-light-fg);
  }

  .form-input, .form-textarea {
    background-color: var(--vscode-light-bg-lighter);
    border: 1px solid var(--vscode-light-border);
    color: var(--vscode-light-fg);
  }

  .cancel-button {
    border: 1px solid var(--vscode-light-border);
    color: var(--vscode-light-fg);
  }

  .cancel-button:hover {
    background-color: var(--vscode-light-hover);
  }
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 16px;
  }
}
</style> 