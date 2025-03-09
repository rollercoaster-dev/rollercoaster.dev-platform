<script setup lang="ts">
import { ref, computed } from 'vue';
import { BadgeRequirement } from '../../types/badge';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  requirements: BadgeRequirement[];
  editable?: boolean;
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  editable: false,
  isLoading: false
});

const emit = defineEmits<{
  (e: 'toggle', payload: { id: string; completed: boolean }): void;
  (e: 'add', requirement: { description: string }): void;
  (e: 'remove', id: string): void;
  (e: 'update', payload: { id: string; description: string }): void;
}>();

// State for new requirement input
const newRequirement = ref('');
const requirementError = ref('');

// State for editing existing requirements
const editingRequirementId = ref<string | null>(null);
const editedDescription = ref('');

// Computed properties
const completedCount = computed(() => {
  return props.requirements.filter(r => r.completed).length;
});

const totalCount = computed(() => {
  return props.requirements.length;
});

const percentComplete = computed(() => {
  if (totalCount.value === 0) return 0;
  return Math.round((completedCount.value / totalCount.value) * 100);
});

// Methods
const toggleRequirement = (id: string, completed: boolean) => {
  emit('toggle', { id, completed });
};

const addRequirement = () => {
  if (props.isLoading) return;
  
  if (!newRequirement.value.trim()) {
    requirementError.value = 'Requirement cannot be empty';
    return;
  }
  
  emit('add', { description: newRequirement.value.trim() });
  newRequirement.value = '';
  requirementError.value = '';
};

const removeRequirement = (id: string) => {
  if (props.isLoading) return;
  emit('remove', id);
};

const startEditing = (requirement: BadgeRequirement) => {
  if (props.isLoading) return;
  editingRequirementId.value = requirement.id;
  editedDescription.value = requirement.description;
};

const saveEditing = (id: string) => {
  if (props.isLoading) return;
  
  if (!editedDescription.value.trim()) {
    // Don't save empty descriptions
    cancelEditing();
    return;
  }
  
  emit('update', { id, description: editedDescription.value.trim() });
  editingRequirementId.value = null;
  editedDescription.value = '';
};

const cancelEditing = () => {
  editingRequirementId.value = null;
  editedDescription.value = '';
};

// Keyboard handlers
const handleKeydown = (event: KeyboardEvent, id: string) => {
  if (event.key === 'Enter') {
    saveEditing(id);
  } else if (event.key === 'Escape') {
    cancelEditing();
  }
};

const handleNewRequirementKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    addRequirement();
  }
};
</script>

<template>
  <div class="requirements-list">
    <div class="requirements-header">
      <h3 class="requirements-title">Requirements</h3>
      <div class="requirements-progress">
        <span>{{ completedCount }}/{{ totalCount }} ({{ percentComplete }}%)</span>
      </div>
    </div>
    
    <div v-if="totalCount === 0" class="empty-requirements">
      <p>No requirements yet.</p>
      <p v-if="editable">Add requirements below to track your progress.</p>
    </div>
    
    <ul class="requirements-items" v-else>
      <li 
        v-for="requirement in requirements" 
        :key="requirement.id"
        class="requirement-item"
        :class="{ 'completed': requirement.completed }"
      >
        <!-- View mode -->
        <div v-if="editingRequirementId !== requirement.id" class="requirement-view">
          <div class="requirement-content">
            <input 
              type="checkbox" 
              :id="`req-${requirement.id}`" 
              :checked="requirement.completed"
              @change="toggleRequirement(requirement.id, !requirement.completed)"
              :disabled="isLoading"
            >
            <label :for="`req-${requirement.id}`">{{ requirement.description }}</label>
          </div>
          
          <div class="requirement-actions" v-if="editable">
            <button 
              class="action-button edit-button" 
              @click="startEditing(requirement)"
              :disabled="isLoading"
              aria-label="Edit requirement"
            >
              <span class="material-icons">edit</span>
            </button>
            <button 
              class="action-button delete-button" 
              @click="removeRequirement(requirement.id)"
              :disabled="isLoading"
              aria-label="Delete requirement"
            >
              <span class="material-icons">delete</span>
            </button>
          </div>
        </div>
        
        <!-- Edit mode -->
        <div v-else class="requirement-edit">
          <input 
            type="text" 
            v-model="editedDescription" 
            class="edit-input"
            @keydown="handleKeydown($event, requirement.id)"
            :disabled="isLoading"
            ref="editInput"
            autofocus
          >
          <div class="edit-actions">
            <button 
              class="action-button save-button" 
              @click="saveEditing(requirement.id)"
              :disabled="isLoading"
              aria-label="Save changes"
            >
              <span class="material-icons">check</span>
            </button>
            <button 
              class="action-button cancel-button" 
              @click="cancelEditing"
              :disabled="isLoading"
              aria-label="Cancel editing"
            >
              <span class="material-icons">close</span>
            </button>
          </div>
        </div>
      </li>
    </ul>
    
    <!-- Add new requirement (only in editable mode) -->
    <div v-if="editable" class="add-requirement">
      <input 
        type="text" 
        v-model="newRequirement" 
        placeholder="Add a new requirement"
        :class="{ 'error-input': requirementError }"
        @keydown="handleNewRequirementKeydown"
        :disabled="isLoading"
      >
      <button 
        class="add-button" 
        @click="addRequirement"
        :disabled="isLoading"
      >
        Add
      </button>
    </div>
    <p v-if="requirementError" class="error-text">{{ requirementError }}</p>
  </div>
</template>

<style scoped>
.requirements-list {
  padding: 16px;
  background-color: var(--editor-content-bg);
  border-radius: 6px;
  border: 1px solid var(--explorer-border-color);
}

.requirements-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.requirements-title {
  margin: 0;
  font-size: 1.1rem;
  color: var(--section-title-color);
}

.requirements-progress {
  font-size: 0.9rem;
  color: var(--progress-text);
}

.empty-requirements {
  padding: 16px;
  text-align: center;
  color: var(--explorer-subtle-color);
  font-size: 0.9rem;
}

.requirements-items {
  list-style: none;
  padding: 0;
  margin: 0 0 16px 0;
}

.requirement-item {
  margin-bottom: 8px;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid var(--explorer-border-color);
  background-color: var(--explorer-input-bg);
  transition: background-color 0.2s ease;
}

.requirement-item:hover {
  background-color: var(--explorer-hover-bg);
}

.requirement-item.completed {
  border-color: var(--completed-color);
  opacity: 0.8;
}

.requirement-view {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.requirement-content {
  display: flex;
  align-items: center;
  flex: 1;
}

.requirement-content input[type="checkbox"] {
  margin-right: 10px;
}

.requirement-content label {
  flex: 1;
  cursor: pointer;
  color: var(--requirement-text);
}

.requirement-item.completed .requirement-content label {
  text-decoration: line-through;
  color: var(--completed-text);
}

.requirement-actions, .edit-actions {
  display: flex;
  gap: 8px;
}

.action-button {
  background: none;
  border: none;
  color: var(--explorer-subtle-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
}

.edit-button:hover {
  background-color: var(--edit-button-hover);
  color: var(--edit-button-color);
}

.delete-button:hover {
  background-color: var(--delete-button-hover);
  color: var(--delete-button-color);
}

.save-button:hover {
  color: var(--completed-color);
}

.cancel-button:hover {
  color: var(--delete-button-color);
}

.requirement-edit {
  display: flex;
  align-items: center;
  gap: 8px;
}

.edit-input {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid var(--explorer-focus-color);
  border-radius: 4px;
  background-color: var(--explorer-input-bg);
  color: var(--explorer-text-color);
}

.add-requirement {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.add-requirement input {
  flex: 1;
  padding: 8px;
  border: 1px solid var(--explorer-border-color);
  border-radius: 4px;
  background-color: var(--explorer-input-bg);
  color: var(--explorer-text-color);
}

.error-input {
  border-color: var(--explorer-error-color) !important;
}

.error-text {
  color: var(--explorer-error-color);
  font-size: 0.8rem;
  margin-top: 4px;
}

.add-button {
  padding: 8px 16px;
  background-color: var(--button-bg);
  color: var(--button-text);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-button:hover {
  background-color: var(--button-hover-bg);
}

/* Material Icons */
.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 18px;
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

button:disabled,
input:disabled,
textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>