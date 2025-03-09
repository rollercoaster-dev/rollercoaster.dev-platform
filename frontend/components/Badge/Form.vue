<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { Badge, BadgeStatus, BadgeRequirement, CreateBadgeDto } from '../../types/badge';

interface Props {
  badge?: Badge;
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  badge: undefined,
  isLoading: false
});

const emit = defineEmits<{
  (e: 'submit', badge: CreateBadgeDto | Partial<Badge>): void;
  (e: 'cancel'): void;
}>();

// Form state
const isEditing = computed(() => !!props.badge);
const formTitle = computed(() => isEditing.value ? 'Edit Badge' : 'Create Badge');

const form = reactive<{
  name: string;
  description: string;
  content: string;
  status: BadgeStatus;
  startDate: string;
  targetDate: string;
  requirements: BadgeRequirement[];
}>({
  name: '',
  description: '',
  content: '',
  status: BadgeStatus.NOT_STARTED,
  startDate: '',
  targetDate: '',
  requirements: []
});

// New requirement state
const newRequirement = ref('');
const requirementError = ref('');

// Form errors
const errors = reactive({
  name: '',
  description: '',
  requirements: ''
});

// Initialize form if editing an existing badge
watch(() => props.badge, (newBadge) => {
  if (newBadge) {
    form.name = newBadge.name;
    form.description = newBadge.description;
    form.content = newBadge.content || '';
    form.status = newBadge.status;
    form.startDate = newBadge.startDate || '';
    form.targetDate = newBadge.targetDate || '';
    form.requirements = [...newBadge.requirements];
  }
}, { immediate: true });

// Validate the form
const validateForm = (): boolean => {
  let isValid = true;

  // Reset errors
  errors.name = '';
  errors.description = '';
  errors.requirements = '';

  // Validate name
  if (!form.name.trim()) {
    errors.name = 'Name is required';
    isValid = false;
  }

  // Validate description
  if (!form.description.trim()) {
    errors.description = 'Description is required';
    isValid = false;
  }

  // Validate requirements (at least one)
  if (form.requirements.length === 0) {
    errors.requirements = 'At least one requirement is needed';
    isValid = false;
  }

  return isValid;
};

// Add a new requirement
const addRequirement = () => {
  if (!newRequirement.value.trim()) {
    requirementError.value = 'Requirement text cannot be empty';
    return;
  }

  form.requirements.push({
    id: uuidv4(),
    description: newRequirement.value.trim(),
    completed: false
  });

  newRequirement.value = '';
  requirementError.value = '';
};

// Remove a requirement
const removeRequirement = (id: string) => {
  form.requirements = form.requirements.filter(r => r.id !== id);
};

// Update a requirement
const updateRequirement = (index: number, description: string) => {
  if (description.trim()) {
    form.requirements[index].description = description.trim();
  }
};

// Submit the form
const submitForm = () => {
  if (!validateForm()) {
    return;
  }

  // Calculate initial progress based on completed requirements
  const completedCount = form.requirements.filter(r => r.completed).length;
  const progress = form.requirements.length > 0 
    ? Math.round((completedCount / form.requirements.length) * 100) 
    : 0;

  // Create badge data object
  const badgeData: CreateBadgeDto | Partial<Badge> = {
    name: form.name,
    description: form.description,
    content: form.content,
    status: form.status,
    progress,
    requirements: form.requirements
  };

  // Add dates if they exist
  if (form.startDate) {
    badgeData.startDate = form.startDate;
  }
  
  if (form.targetDate) {
    badgeData.targetDate = form.targetDate;
  }

  emit('submit', badgeData);
};

// Cancel form
const cancelForm = () => {
  emit('cancel');
};
</script>

<template>
  <div class="badge-form">
    <h2 class="form-title">{{ formTitle }}</h2>
    
    <form @submit.prevent="submitForm">
      <!-- Badge Name -->
      <div class="form-group">
        <label for="badge-name">Name *</label>
        <input 
          id="badge-name" 
          v-model="form.name" 
          type="text" 
          placeholder="Badge name"
          :class="{ 'error-input': errors.name }"
          :disabled="isLoading"
        >
        <p v-if="errors.name" class="error-text">{{ errors.name }}</p>
      </div>

      <!-- Badge Description -->
      <div class="form-group">
        <label for="badge-description">Description *</label>
        <textarea 
          id="badge-description" 
          v-model="form.description" 
          rows="3" 
          placeholder="Badge description"
          :class="{ 'error-input': errors.description }"
          :disabled="isLoading"
        ></textarea>
        <p v-if="errors.description" class="error-text">{{ errors.description }}</p>
      </div>

      <!-- Badge Content (Optional) -->
      <div class="form-group">
        <label for="badge-content">Content (Optional)</label>
        <textarea 
          id="badge-content" 
          v-model="form.content" 
          rows="5" 
          placeholder="Badge content or notes (supports markdown)"
          :disabled="isLoading"
        ></textarea>
      </div>

      <!-- Badge Status -->
      <div class="form-group">
        <label for="badge-status">Status</label>
        <select 
          id="badge-status" 
          v-model="form.status"
          :disabled="isLoading"
        >
          <option :value="BadgeStatus.NOT_STARTED">Not Started</option>
          <option :value="BadgeStatus.IN_PROGRESS">In Progress</option>
          <option :value="BadgeStatus.COMPLETED">Completed</option>
        </select>
      </div>

      <!-- Date Section -->
      <div class="date-section">
        <div class="form-group form-group-half">
          <label for="start-date">Start Date (Optional)</label>
          <input 
            id="start-date" 
            v-model="form.startDate" 
            type="date"
            :disabled="isLoading"
          >
        </div>
        
        <div class="form-group form-group-half">
          <label for="target-date">Target Date (Optional)</label>
          <input 
            id="target-date" 
            v-model="form.targetDate" 
            type="date"
            :disabled="isLoading"
          >
        </div>
      </div>

      <!-- Requirements Section -->
      <div class="form-group">
        <label for="badge-requirements">Requirements *</label>
        <p v-if="errors.requirements" class="error-text">{{ errors.requirements }}</p>
        
        <div class="requirements-list">
          <div 
            v-for="(requirement, index) in form.requirements" 
            :key="requirement.id"
            class="requirement-item"
          >
            <div class="requirement-text">
              <input 
                type="checkbox" 
                :id="`req-${requirement.id}`" 
                v-model="requirement.completed"
                :disabled="isLoading"
              >
              <label :for="`req-${requirement.id}`">{{ requirement.description }}</label>
            </div>
            <button 
              type="button" 
              class="remove-requirement" 
              @click="removeRequirement(requirement.id)"
              :disabled="isLoading"
              aria-label="Remove requirement"
            >
              <span class="material-icons">delete</span>
            </button>
          </div>
        </div>

        <!-- Add new requirement -->
        <div class="add-requirement">
          <input 
            type="text" 
            v-model="newRequirement" 
            placeholder="New requirement"
            :class="{ 'error-input': requirementError }"
            :disabled="isLoading"
            @keyup.enter="addRequirement"
          >
          <button 
            type="button" 
            class="add-requirement-btn" 
            @click="addRequirement"
            :disabled="isLoading"
          >
            Add
          </button>
        </div>
        <p v-if="requirementError" class="error-text">{{ requirementError }}</p>
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <button 
          type="button" 
          class="cancel-button" 
          @click="cancelForm"
          :disabled="isLoading"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          class="submit-button" 
          :disabled="isLoading"
        >
          {{ isEditing ? 'Update Badge' : 'Create Badge' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.badge-form {
  padding: 20px;
  background-color: var(--editor-content-bg);
  color: var(--editor-text);
  max-width: 600px;
  margin: 0 auto;
}

.form-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: var(--title-color);
}

.form-group {
  margin-bottom: 16px;
}

.form-group-half {
  display: inline-block;
  width: calc(50% - 10px);
}

.form-group-half:first-child {
  margin-right: 16px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.9rem;
  color: var(--section-title-color);
}

input[type="text"],
input[type="date"],
textarea,
select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--explorer-border-color);
  border-radius: 4px;
  background-color: var(--explorer-input-bg);
  color: var(--explorer-text-color);
  font-size: 0.9rem;
}

input[type="text"]:focus,
input[type="date"]:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: var(--explorer-focus-color);
}

.error-input {
  border-color: var(--explorer-error-color) !important;
}

.error-text {
  color: var(--explorer-error-color);
  font-size: 0.8rem;
  margin-top: 4px;
}

.date-section {
  display: flex;
  margin-bottom: 16px;
}

.requirements-list {
  margin-bottom: 12px;
}

.requirement-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  margin-bottom: 8px;
  border: 1px solid var(--explorer-border-color);
  border-radius: 4px;
  background-color: var(--explorer-input-bg);
}

.requirement-text {
  display: flex;
  align-items: center;
}

.requirement-text input[type="checkbox"] {
  margin-right: 10px;
}

.remove-requirement {
  background: none;
  border: none;
  color: var(--explorer-subtle-color);
  cursor: pointer;
}

.remove-requirement:hover {
  color: var(--delete-button-color);
}

.add-requirement {
  display: flex;
  margin-bottom: 8px;
}

.add-requirement input {
  flex: 1;
  margin-right: 8px;
}

.add-requirement-btn {
  padding: 8px 16px;
  background-color: var(--explorer-button-bg);
  color: var(--editor-text);
  border: 1px solid var(--explorer-border-color);
  border-radius: 4px;
  cursor: pointer;
}

.add-requirement-btn:hover {
  background-color: var(--explorer-button-hover-bg);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
}

.cancel-button {
  padding: 8px 16px;
  margin-right: 12px;
  background-color: var(--explorer-button-bg);
  color: var(--editor-text);
  border: 1px solid var(--explorer-border-color);
  border-radius: 4px;
  cursor: pointer;
}

.cancel-button:hover {
  background-color: var(--explorer-button-hover-bg);
}

.submit-button {
  padding: 8px 16px;
  background-color: var(--button-bg);
  color: var(--button-text);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: var(--button-hover-bg);
}

button:disabled,
input:disabled,
textarea:disabled,
select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>