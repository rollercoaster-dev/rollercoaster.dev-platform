<template>
  <div class="requirements-container">
    <h3 v-if="showTitle">{{ title }}</h3>
    <ul class="requirements-list">
      <li 
        v-for="(req, index) in requirements" 
        :key="req.id" 
        class="requirement-item"
      >
        <!-- View mode -->
        <label v-if="!isEditing" class="requirement-label">
          <input 
            type="checkbox" 
            :checked="req.completed" 
            @change="toggleRequirement(req.id, !req.completed)"
            class="requirement-checkbox"
            :disabled="disabled"
          />
          <span class="requirement-text">{{ req.description }}</span>
        </label>

        <!-- Edit mode -->
        <div v-else class="requirement-input-group">
          <input 
            v-model="req.description" 
            type="text" 
            placeholder="Requirement description" 
            class="form-input requirement-input"
          />
          <button 
            type="button" 
            @click="removeRequirement(index)" 
            class="remove-requirement-button"
            aria-label="Remove requirement"
            :disabled="requirements.length <= 1"
          >
            <MinusIcon class="icon" />
          </button>
        </div>
      </li>
    </ul>

    <!-- Add requirement button (edit mode only) -->
    <button 
      v-if="isEditing"
      type="button" 
      @click="addRequirement" 
      class="add-requirement-button"
    >
      <PlusIcon class="icon" /> Add Requirement
    </button>
  </div>
</template>

<script setup lang="ts">
import { Plus as PlusIcon, Minus as MinusIcon } from 'lucide-vue-next'
import type { BadgeRequirement } from '../../../shared/types/badge'

interface Props {
  requirements: BadgeRequirement[]
  isEditing?: boolean
  disabled?: boolean
  showTitle?: boolean
  title?: string
}

interface Emits {
  (e: 'update:requirements', requirements: BadgeRequirement[]): void
  (e: 'toggle', id: string, completed: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  isEditing: false,
  disabled: false,
  showTitle: true,
  title: 'Requirements'
})

const emit = defineEmits<Emits>()

const addRequirement = () => {
  const newRequirements = [...props.requirements]
  newRequirements.push({
    id: crypto.randomUUID(),
    description: '',
    completed: false
  })
  emit('update:requirements', newRequirements)
}

const removeRequirement = (index: number) => {
  if (props.requirements.length <= 1) return
  const newRequirements = [...props.requirements]
  newRequirements.splice(index, 1)
  emit('update:requirements', newRequirements)
}

const toggleRequirement = (id: string, completed: boolean) => {
  emit('toggle', id, completed)
}
</script>

<style scoped>
.requirements-container {
  margin-bottom: 24px;
}

.requirements-container h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.requirements-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.requirement-item {
  margin-bottom: 8px;
}

.requirement-label {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
}

.requirement-checkbox {
  margin-top: 3px;
}

.requirement-text {
  font-size: 14px;
  line-height: 1.5;
}

.requirement-input-group {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.requirement-input {
  flex: 1;
}

.remove-requirement-button {
  background-color: transparent;
  border: none;
  color: var(--vscode-fg-subtle);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
}

.remove-requirement-button:hover:not(:disabled) {
  background-color: rgba(241, 76, 76, 0.2);
  color: var(--vscode-error);
}

.remove-requirement-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.add-requirement-button {
  background-color: transparent;
  border: 1px solid var(--vscode-border);
  color: var(--vscode-fg);
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background-color 0.2s;
}

.add-requirement-button:hover {
  background-color: var(--vscode-hover);
}

/* Dark mode overrides */
:deep(.badge-manager:not(.dark)) {
  .remove-requirement-button {
    color: var(--vscode-light-fg-subtle);
  }

  .add-requirement-button {
    border: 1px solid var(--vscode-light-border);
    color: var(--vscode-light-fg);
  }

  .add-requirement-button:hover {
    background-color: var(--vscode-light-hover);
  }
}
</style> 