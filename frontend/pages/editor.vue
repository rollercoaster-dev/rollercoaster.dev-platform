<template>
  <div class="badge-manager" :class="{ 'dark': isDarkMode }">
    <div class="badge-manager-container">
      <!-- Sidebar -->
      <div class="sidebar">
        <div class="sidebar-header">
          <h2 class="sidebar-title">Badges</h2>
          <div class="sidebar-actions">
            <button 
              class="action-button" 
              @click="showCreateModal = true" 
              aria-label="Create new badge"
            >
              <PlusIcon class="icon" />
            </button>
            <button 
              class="action-button" 
              @click="toggleDarkMode" 
              aria-label="Toggle dark mode"
            >
              <SunIcon v-if="isDarkMode" class="icon" />
              <MoonIcon v-else class="icon" />
            </button>
          </div>
        </div>
        
        <div class="search-container">
          <SearchIcon class="search-icon" />
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search badges..." 
            class="search-input"
            aria-label="Search badges"
          />
        </div>
        
        <div v-if="isLoading" class="loading-container">
          <LoaderIcon class="loading-icon spin" />
          <span>Loading badges...</span>
        </div>
        
        <div v-else-if="error" class="error-container">
          <AlertCircleIcon class="error-icon" />
          <span>{{ error.message }}</span>
          <button @click="error.retry?.()" class="retry-button">Retry</button>
        </div>
        
        <div v-else-if="filteredBadges.length === 0" class="empty-container">
          <InboxIcon class="empty-icon" />
          <span>No badges found</span>
        </div>
        
        <ul v-else class="badge-list" role="tree">
          <li 
            v-for="badge in filteredBadges" 
            :key="badge.id" 
            class="badge-item" 
            :class="{ 'selected': selectedBadgeId === badge.id }"
            @click="selectBadge(badge.id)"
            @keydown.enter="selectBadge(badge.id)"
            @keydown.space="selectBadge(badge.id)"
            tabindex="0"
            role="treeitem"
            :aria-selected="selectedBadgeId === badge.id"
          >
            <div class="badge-item-content">
              <span 
                class="status-indicator" 
                :class="getStatusClass(badge.status)"
                :aria-label="getStatusLabel(badge.status)"
              ></span>
              <span class="badge-name">{{ badge.name }}</span>
              <span class="badge-progress">{{ badge.progress }}%</span>
            </div>
          </li>
        </ul>
      </div>
      
      <!-- Main Panel -->
      <div class="main-panel">
        <div v-if="!selectedBadge" class="empty-selection">
          <AwardIcon class="empty-selection-icon" />
          <h2>Select a badge to view details</h2>
          <button 
            class="create-button" 
            @click="showCreateModal = true"
          >
            Create New Badge
          </button>
        </div>
        
        <div v-else-if="selectedBadgeLoading" class="loading-container centered">
          <LoaderIcon class="loading-icon spin" />
          <span>Loading badge details...</span>
        </div>
        
        <div v-else-if="selectedBadgeError" class="error-container centered">
          <AlertCircleIcon class="error-icon" />
          <span>{{ selectedBadgeError.message }}</span>
          <button @click="selectedBadgeError.retry?.()" class="retry-button">Retry</button>
        </div>
        
        <div v-else class="badge-details">
          <div class="badge-details-header">
            <h2 class="badge-title">{{ selectedBadge.name }}</h2>
            <div class="badge-actions">
              <button 
                class="action-button" 
                @click="showEditModal = true" 
                aria-label="Edit badge"
              >
                <EditIcon class="icon" />
              </button>
              <button 
                class="action-button danger" 
                @click="confirmDelete" 
                aria-label="Delete badge"
              >
                <TrashIcon class="icon" />
              </button>
            </div>
          </div>
          
          <div class="badge-info">
            <p class="badge-description">{{ selectedBadge.description }}</p>
            
            <div class="badge-dates">
              <div v-if="selectedBadge.startDate" class="date-item">
                <CalendarIcon class="date-icon" />
                <span>Started: {{ formatDate(selectedBadge.startDate) }}</span>
              </div>
              <div v-if="selectedBadge.targetDate" class="date-item">
                <TargetIcon class="date-icon" />
                <span>Target: {{ formatDate(selectedBadge.targetDate) }}</span>
              </div>
            </div>
            
            <div class="progress-container">
              <div class="progress-header">
                <span>Progress</span>
                <span>{{ selectedBadge.progress }}%</span>
              </div>
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: `${selectedBadge.progress}%` }"
                  :class="getProgressClass(selectedBadge.progress)"
                ></div>
              </div>
            </div>
            
            <div class="requirements-container">
              <h3>Requirements</h3>
              <ul class="requirements-list">
                <li 
                  v-for="req in selectedBadge.requirements" 
                  :key="req.id" 
                  class="requirement-item"
                >
                  <label class="requirement-label">
                    <input 
                      type="checkbox" 
                      :checked="req.completed" 
                      @change="toggleRequirement(req.id, !req.completed)"
                      class="requirement-checkbox"
                    />
                    <span class="requirement-text">{{ req.description }}</span>
                  </label>
                </li>
              </ul>
            </div>
            
            <div v-if="selectedBadge.content" class="badge-content">
              <h3>Additional Content</h3>
              <div class="content-box">{{ selectedBadge.content }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Create Badge Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click="showCreateModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Create New Badge</h2>
          <button class="close-button" @click="showCreateModal = false" aria-label="Close modal">
            <XIcon class="icon" />
          </button>
        </div>
        
        <form @submit.prevent="createNewBadge" class="badge-form">
          <div class="form-group">
            <label for="badge-name">Name</label>
            <input 
              id="badge-name" 
              v-model="newBadge.name" 
              type="text" 
              required 
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label for="badge-description">Description</label>
            <textarea 
              id="badge-description" 
              v-model="newBadge.description" 
              required 
              class="form-textarea"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="badge-content">Additional Content (Optional)</label>
            <textarea 
              id="badge-content" 
              v-model="newBadge.content" 
              class="form-textarea"
            ></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group half">
              <label for="badge-start-date">Start Date (Optional)</label>
              <input 
                id="badge-start-date" 
                v-model="newBadge.startDate" 
                type="date" 
                class="form-input"
              />
            </div>
            
            <div class="form-group half">
              <label for="badge-target-date">Target Date (Optional)</label>
              <input 
                id="badge-target-date" 
                v-model="newBadge.targetDate" 
                type="date" 
                class="form-input"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label>Requirements</label>
            <div v-for="(req, index) in newBadge.requirements" :key="index" class="requirement-input-group">
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
              >
                <MinusIcon class="icon" />
              </button>
            </div>
            <button 
              type="button" 
              @click="addRequirement" 
              class="add-requirement-button"
            >
              <PlusIcon class="icon" /> Add Requirement
            </button>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="showCreateModal = false" class="cancel-button">Cancel</button>
            <button type="submit" class="submit-button" :disabled="isCreating">
              <LoaderIcon v-if="isCreating" class="icon spin" />
              <span v-else>Create Badge</span>
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Edit Badge Modal -->
    <div v-if="showEditModal && selectedBadge" class="modal-overlay" @click="showEditModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Edit Badge</h2>
          <button class="close-button" @click="showEditModal = false" aria-label="Close modal">
            <XIcon class="icon" />
          </button>
        </div>
        
        <form @submit.prevent="updateExistingBadge" class="badge-form">
          <div class="form-group">
            <label for="edit-badge-name">Name</label>
            <input 
              id="edit-badge-name" 
              v-model="editBadge.name" 
              type="text" 
              required 
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label for="edit-badge-description">Description</label>
            <textarea 
              id="edit-badge-description" 
              v-model="editBadge.description" 
              required 
              class="form-textarea"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="edit-badge-content">Additional Content (Optional)</label>
            <textarea 
              id="edit-badge-content" 
              v-model="editBadge.content" 
              class="form-textarea"
            ></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group half">
              <label for="edit-badge-start-date">Start Date (Optional)</label>
              <input 
                id="edit-badge-start-date" 
                v-model="editBadge.startDate" 
                type="date" 
                class="form-input"
              />
            </div>
            
            <div class="form-group half">
              <label for="edit-badge-target-date">Target Date (Optional)</label>
              <input 
                id="edit-badge-target-date" 
                v-model="editBadge.targetDate" 
                type="date" 
                class="form-input"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label>Requirements</label>
            <div v-for="(req, index) in editBadge.requirements" :key="index" class="requirement-input-group">
              <input 
                v-model="req.description" 
                type="text" 
                placeholder="Requirement description" 
                class="form-input requirement-input"
              />
              <button 
                type="button" 
                @click="removeEditRequirement(index)" 
                class="remove-requirement-button"
                aria-label="Remove requirement"
              >
                <MinusIcon class="icon" />
              </button>
            </div>
            <button 
              type="button" 
              @click="addEditRequirement" 
              class="add-requirement-button"
            >
              <PlusIcon class="icon" /> Add Requirement
            </button>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="showEditModal = false" class="cancel-button">Cancel</button>
            <button type="submit" class="submit-button" :disabled="isUpdating">
              <LoaderIcon v-if="isUpdating" class="icon spin" />
              <span v-else>Update Badge</span>
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal-content delete-modal" @click.stop>
        <div class="modal-header">
          <h2>Delete Badge</h2>
          <button class="close-button" @click="showDeleteModal = false" aria-label="Close modal">
            <XIcon class="icon" />
          </button>
        </div>
        
        <div class="delete-content">
          <AlertTriangleIcon class="delete-icon" />
          <p>Are you sure you want to delete <strong>{{ selectedBadge?.name }}</strong>?</p>
          <p class="delete-warning">This action cannot be undone.</p>
        </div>
        
        <div class="form-actions">
          <button type="button" @click="showDeleteModal = false" class="cancel-button">Cancel</button>
          <button 
            type="button" 
            @click="deleteBadgeConfirmed" 
            class="delete-button" 
            :disabled="isDeleting"
          >
            <LoaderIcon v-if="isDeleting" class="icon spin" />
            <span v-else>Delete</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Error Modal -->
    <div v-if="errorModal" class="modal-overlay" @click="errorModal = null">
      <div class="modal-content error-modal" @click.stop>
        <div class="modal-header">
          <h2>{{ errorModal.title }}</h2>
        </div>
        <div class="error-content">
          <p>{{ errorModal.message }}</p>
        </div>
        <div class="form-actions">
          <button class="submit-button" @click="errorModal = null">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { badgeService, BadgeServiceError, BadgeNotFoundError, BadgeValidationError } from '@/services/badgeService';
import { BadgeStatus } from '@/shared/types/badge';
import type { 
  Badge, 
  BadgeRequirement,
  BadgeRequirementBase,
  CreateBadgeDto,
  UpdateBadgeProgressDto
} from '@/shared/types/badge';
import { 
  Search as SearchIcon,
  Plus as PlusIcon,
  Edit as EditIcon,
  Trash as TrashIcon,
  AlertCircle as AlertCircleIcon,
  Loader as LoaderIcon,
  Award as AwardIcon,
  Calendar as CalendarIcon,
  Target as TargetIcon,
  X as XIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
  Inbox as InboxIcon,
  AlertTriangle as AlertTriangleIcon,
  Minus as MinusIcon
} from 'lucide-vue-next';

// State
const badges = ref<Badge[]>([]);
const selectedBadgeId = ref<string | null>(null);
const selectedBadge = ref<Badge | null>(null);
const searchQuery = ref('');
const isLoading = ref(false);
const error = ref<{ message: string; retry?: () => Promise<void> } | null>(null);
const selectedBadgeLoading = ref(false);
const selectedBadgeError = ref<{ message: string; retry?: () => Promise<void> } | null>(null);
const isDarkMode = ref(true);

// Modal state
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);

// Form state
const newBadge = ref({
  name: '',
  description: '',
  content: '',
  startDate: '',
  targetDate: '',
  requirements: [{ description: '', completed: false }]
});

const editBadge = ref<{
  name: string;
  description: string;
  content?: string;
  startDate?: string;
  targetDate?: string;
  requirements: { id?: string; description: string; completed: boolean }[];
}>({
  name: '',
  description: '',
  content: '',
  startDate: '',
  targetDate: '',
  requirements: []
});

// Loading states for operations
const isCreating = ref(false);
const isUpdating = ref(false);
const isDeleting = ref(false);
const isTogglingRequirement = ref<string | null>(null);

const errorModal = ref<{ title: string; message: string } | null>(null);

// Computed properties
const filteredBadges = computed(() => {
  if (!searchQuery.value) return badges.value;
  
  const query = searchQuery.value.toLowerCase();
  return badges.value.filter((badge: Badge) => 
    badge.name.toLowerCase().includes(query) || 
    badge.description.toLowerCase().includes(query)
  );
});

// Lifecycle hooks
onMounted(() => {
  loadBadges();
  
  // Check for user preference
  const storedTheme = localStorage.getItem('badgeManagerTheme');
  if (storedTheme) {
    isDarkMode.value = storedTheme === 'dark';
  }
});

// Watch for selected badge changes
watch(selectedBadgeId, (newId) => {
  if (newId) {
    loadSelectedBadge();
  } else {
    selectedBadge.value = null;
  }
});

// Methods
const handleError = (error: unknown, context: string): string => {
  console.error(`${context}:`, error);
  
  let message = '';
  let title = 'localhost:3001 says';
  
  if (error instanceof BadgeNotFoundError) {
    message = 'Badge not found. It may have been deleted.';
  } else if (error instanceof BadgeValidationError) {
    message = 'Invalid data provided. Please check your input.';
  } else if (error instanceof BadgeServiceError) {
    if (error.statusCode === 503) {
      message = 'Service is temporarily unavailable. Please try again later.';
    } else {
      message = error.message;
    }
  } else {
    message = 'Failed to create badge due to network error';
  }
  
  // Show error in modal
  errorModal.value = { title, message };
  
  return message;
};

const loadBadges = async () => {
  if (isLoading.value) return;
  
  isLoading.value = true;
  error.value = null;
  
  try {
    badges.value = await badgeService.getBadges();
  } catch (err) {
    const message = handleError(err, 'Error loading badges');
    error.value = {
      message,
      retry: loadBadges
    };
  } finally {
    isLoading.value = false;
  }
};

const loadSelectedBadge = async () => {
  if (!selectedBadgeId.value || selectedBadgeLoading.value) return;
  
  selectedBadgeLoading.value = true;
  selectedBadgeError.value = null;
  
  try {
    selectedBadge.value = await badgeService.getBadgeById(selectedBadgeId.value);
  } catch (err) {
    const message = handleError(err, 'Error loading badge details');
    selectedBadgeError.value = {
      message,
      retry: loadSelectedBadge
    };
    
    if (err instanceof BadgeNotFoundError) {
      // Remove the badge from the list if it's not found
      badges.value = badges.value.filter(b => b.id !== selectedBadgeId.value);
      selectedBadgeId.value = null;
    }
  } finally {
    selectedBadgeLoading.value = false;
  }
};

const selectBadge = (id: string) => {
  selectedBadgeId.value = id;
};

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('badgeManagerTheme', isDarkMode.value ? 'dark' : 'light');
};

const getStatusClass = (status: BadgeStatus) => {
  switch (status) {
    case BadgeStatus.NOT_STARTED:
      return 'status-not-started';
    case BadgeStatus.IN_PROGRESS:
      return 'status-in-progress';
    case BadgeStatus.COMPLETED:
      return 'status-completed';
    default:
      return '';
  }
};

const getStatusLabel = (status: BadgeStatus) => {
  switch (status) {
    case BadgeStatus.NOT_STARTED:
      return 'Not started';
    case BadgeStatus.IN_PROGRESS:
      return 'In progress';
    case BadgeStatus.COMPLETED:
      return 'Completed';
    default:
      return 'Unknown status';
  }
};

const getProgressClass = (progress: number) => {
  if (progress >= 100) return 'progress-complete';
  if (progress >= 50) return 'progress-halfway';
  return 'progress-started';
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

// CRUD operations
const createNewBadge = async () => {
  if (isCreating.value) return;
  
  isCreating.value = true;
  
  try {
    const createBadgeDto: CreateBadgeDto = {
      name: newBadge.value.name,
      description: newBadge.value.description,
      content: newBadge.value.content || undefined,
      startDate: newBadge.value.startDate || undefined,
      targetDate: newBadge.value.targetDate || undefined,
      progress: 0,
      status: BadgeStatus.NOT_STARTED,
      requirements: newBadge.value.requirements.map(req => ({
        description: req.description,
        completed: false
      })) as BadgeRequirementBase[]
    };
    
    const createdBadge = await badgeService.createBadge(createBadgeDto);
    
    // Optimistically add to list
    badges.value.push(createdBadge);
    showCreateModal.value = false;
    
    // Reset form
    newBadge.value = {
      name: '',
      description: '',
      content: '',
      startDate: '',
      targetDate: '',
      requirements: [{ description: '', completed: false }]
    };
    
    // Select the newly created badge
    selectedBadgeId.value = createdBadge.id;
  } catch (err) {
    handleError(err, 'Error creating badge');
  } finally {
    isCreating.value = false;
  }
};

const updateExistingBadge = async () => {
  if (!selectedBadge.value || isUpdating.value) return;
  
  isUpdating.value = true;
  
  try {
    const updateBadgeDto: Partial<Badge> = {
      name: editBadge.value.name,
      description: editBadge.value.description,
      content: editBadge.value.content || undefined,
      startDate: editBadge.value.startDate || undefined,
      targetDate: editBadge.value.targetDate || undefined,
      requirements: editBadge.value.requirements.map(req => ({
        id: req.id || '',
        description: req.description,
        completed: req.completed
      }))
    };
    
    // Store original badge for rollback
    const originalBadge = { ...selectedBadge.value };
    
    // Optimistically update local state
    Object.assign(selectedBadge.value, updateBadgeDto);
    const index = badges.value.findIndex((b: Badge) => b.id === selectedBadge.value?.id);
    if (index !== -1) {
      badges.value[index] = { ...badges.value[index], ...updateBadgeDto };
    }
    
    // Update on server
    const updatedBadge = await badgeService.updateBadge(selectedBadge.value.id, updateBadgeDto);
    
    // Update with server response
    selectedBadge.value = updatedBadge;
    if (index !== -1) {
      badges.value[index] = updatedBadge;
    }
    
    showEditModal.value = false;
  } catch (err) {
    handleError(err, 'Error updating badge');
    
    // Rollback on error if we have the original badge
    if (selectedBadge.value) {
      const index = badges.value.findIndex((b: Badge) => b.id === selectedBadge.value?.id);
      if (index !== -1) {
        badges.value[index] = { ...badges.value[index] };
      }
    }
  } finally {
    isUpdating.value = false;
  }
};

const toggleRequirement = async (reqId: string, completed: boolean) => {
  if (!selectedBadge.value || isTogglingRequirement.value === reqId) return;
  
  isTogglingRequirement.value = reqId;
  
  try {
    // Find the requirement
    const requirement = selectedBadge.value.requirements.find((r: BadgeRequirement) => r.id === reqId);
    if (!requirement) return;
    
    // Store original state for rollback
    const originalState = {
      requirement: { ...requirement },
      badge: { ...selectedBadge.value }
    };
    
    // Update locally first for immediate feedback
    requirement.completed = completed;
    
    // Calculate new progress
    const totalReqs = selectedBadge.value.requirements.length;
    const completedReqs = selectedBadge.value.requirements.filter((r: BadgeRequirement) => r.completed).length;
    const newProgress = Math.round((completedReqs / totalReqs) * 100);
    
    // Determine new status
    let newStatus = selectedBadge.value.status;
    if (newProgress === 0) {
      newStatus = BadgeStatus.NOT_STARTED;
    } else if (newProgress === 100) {
      newStatus = BadgeStatus.COMPLETED;
    } else {
      newStatus = BadgeStatus.IN_PROGRESS;
    }
    
    // Update progress locally
    selectedBadge.value.progress = newProgress;
    selectedBadge.value.status = newStatus;
    
    // Update badge in list
    const index = badges.value.findIndex((b: Badge) => b.id === selectedBadge.value?.id);
    if (index !== -1) {
      badges.value[index] = { ...selectedBadge.value };
    }
    
    // Update progress on server
    const progressData: UpdateBadgeProgressDto = {
      progress: newProgress,
      status: newStatus,
      requirements: selectedBadge.value.requirements.map((r: BadgeRequirement) => ({
        id: r.id,
        completed: r.completed
      }))
    };
    
    const updatedBadge = await badgeService.updateBadgeProgress(
      selectedBadge.value.id, 
      progressData
    );
    
    // Update with server response
    selectedBadge.value = updatedBadge;
    if (index !== -1) {
      badges.value[index] = updatedBadge;
    }
  } catch (err) {
    handleError(err, 'Error updating requirement');
    
    // Revert changes on error
    if (selectedBadge.value) {
      await loadSelectedBadge();
    }
  } finally {
    isTogglingRequirement.value = null;
  }
};

const confirmDelete = () => {
  showDeleteModal.value = true;
};

const deleteBadgeConfirmed = async () => {
  if (!selectedBadge.value || isDeleting.value) return;
  
  isDeleting.value = true;
  
  try {
    const badgeToDelete = selectedBadge.value;
    
    // Optimistically update UI
    badges.value = badges.value.filter((b: Badge) => b.id !== badgeToDelete.id);
    selectedBadgeId.value = null;
    selectedBadge.value = null;
    showDeleteModal.value = false;
    
    // Delete on server
    await badgeService.deleteBadge(badgeToDelete.id);
  } catch (err) {
    handleError(err, 'Error deleting badge');
    
    // Rollback on error
    await loadBadges();
  } finally {
    isDeleting.value = false;
  }
};

// Form helpers
const addRequirement = () => {
  newBadge.value.requirements.push({ description: '', completed: false });
};

const removeRequirement = (index: number) => {
  if (newBadge.value.requirements.length > 1) {
    newBadge.value.requirements.splice(index, 1);
  }
};

const addEditRequirement = () => {
  editBadge.value.requirements.push({ description: '', completed: false });
};

const removeEditRequirement = (index: number) => {
  if (editBadge.value.requirements.length > 1) {
    editBadge.value.requirements.splice(index, 1);
  }
};

// Initialize edit form when opening edit modal
watch(showEditModal, (isOpen) => {
  if (isOpen && selectedBadge.value) {
    editBadge.value = {
      name: selectedBadge.value.name,
      description: selectedBadge.value.description,
      content: selectedBadge.value.content || '',
      startDate: selectedBadge.value.startDate || '',
      targetDate: selectedBadge.value.targetDate || '',
      requirements: selectedBadge.value.requirements.map(req => ({
        id: req.id,
        description: req.description,
        completed: req.completed
      }))
    };
  }
});
</script>

<style>
/* Base styles */
:root {
  --vscode-bg: #1e1e1e;
  --vscode-bg-light: #252526;
  --vscode-bg-lighter: #2d2d2d;
  --vscode-bg-lightest: #333333;
  --vscode-fg: #cccccc;
  --vscode-fg-subtle: #a0a0a0;
  --vscode-border: #3c3c3c;
  --vscode-focus: #007fd4;
  --vscode-selection: #264f78;
  --vscode-hover: #2a2d2e;
  --vscode-error: #f14c4c;
  --vscode-warning: #cca700;
  --vscode-success: #89d185;
  --vscode-progress-blue: #0e70c0;
  --vscode-progress-green: #388a34;
  --vscode-progress-yellow: #a78100;
  
  /* Light theme colors */
  --vscode-light-bg: #f3f3f3;
  --vscode-light-bg-light: #e8e8e8;
  --vscode-light-bg-lighter: #dfdfdf;
  --vscode-light-bg-lightest: #d0d0d0;
  --vscode-light-fg: #333333;
  --vscode-light-fg-subtle: #616161;
  --vscode-light-border: #c8c8c8;
  --vscode-light-focus: #0066b8;
  --vscode-light-selection: #add6ff;
  --vscode-light-hover: #e8e8e8;
}

.badge-manager {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: var(--vscode-fg);
  background-color: var(--vscode-bg);
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.badge-manager.dark {
  color: var(--vscode-fg);
  background-color: var(--vscode-bg);
}

.badge-manager:not(.dark) {
  color: var(--vscode-light-fg);
  background-color: var(--vscode-light-bg);
}

.badge-manager-container {
  display: flex;
  height: 100%;
  overflow: hidden;
}

/* Sidebar styles */
.sidebar {
  width: 300px;
  height: 100%;
  background-color: var(--vscode-bg-light);
  border-right: 1px solid var(--vscode-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.badge-manager:not(.dark) .sidebar {
  background-color: var(--vscode-light-bg-light);
  border-right: 1px solid var(--vscode-light-border);
}

.sidebar-header {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--vscode-border);
}

.badge-manager:not(.dark) .sidebar-header {
  border-bottom: 1px solid var(--vscode-light-border);
}

.sidebar-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sidebar-actions {
  display: flex;
  gap: 8px;
}

.action-button {
  background: transparent;
  border: none;
  color: var(--vscode-fg-subtle);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s, color 0.2s;
}

.badge-manager:not(.dark) .action-button {
  color: var(--vscode-light-fg-subtle);
}

.action-button:hover {
  background-color: var(--vscode-hover);
  color: var(--vscode-fg);
}

.badge-manager:not(.dark) .action-button:hover {
  background-color: var(--vscode-light-hover);
  color: var(--vscode-light-fg);
}

.action-button:focus-visible {
  outline: 2px solid var(--vscode-focus);
  outline-offset: 2px;
}

.action-button.danger:hover {
  background-color: rgba(241, 76, 76, 0.2);
  color: var(--vscode-error);
}

.icon {
  width: 16px;
  height: 16px;
}

.search-container {
  padding: 8px 16px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--vscode-fg-subtle);
}

.badge-manager:not(.dark) .search-icon {
  color: var(--vscode-light-fg-subtle);
}

.search-input {
  width: 100%;
  background-color: var(--vscode-bg-lighter);
  border: 1px solid var(--vscode-border);
  color: var(--vscode-fg);
  padding: 6px 8px 6px 32px;
  border-radius: 4px;
  font-size: 13px;
}

.badge-manager:not(.dark) .search-input {
  background-color: var(--vscode-light-bg-lighter);
  border: 1px solid var(--vscode-light-border);
  color: var(--vscode-light-fg);
}

.search-input:focus {
  outline: 2px solid var(--vscode-focus);
  outline-offset: -1px;
  border-color: transparent;
}

.badge-list {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  flex: 1;
}

.badge-item {
  padding: 6px 16px;
  cursor: pointer;
  border-left: 2px solid transparent;
  transition: background-color 0.2s;
}

.badge-item:hover {
  background-color: var(--vscode-hover);
}

.badge-manager:not(.dark) .badge-item:hover {
  background-color: var(--vscode-light-hover);
}

.badge-item.selected {
  background-color: var(--vscode-selection);
  border-left-color: var(--vscode-focus);
}

.badge-manager:not(.dark) .badge-item.selected {
  background-color: var(--vscode-light-selection);
  border-left-color: var(--vscode-light-focus);
}

.badge-item:focus-visible {
  outline: 2px solid var(--vscode-focus);
  outline-offset: -2px;
}

.badge-item-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-not-started {
  background-color: var(--vscode-fg-subtle);
}

.status-in-progress {
  background-color: var(--vscode-progress-blue);
}

.status-completed {
  background-color: var(--vscode-success);
}

.badge-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 13px;
}

.badge-progress {
  font-size: 11px;
  color: var(--vscode-fg-subtle);
}

.badge-manager:not(.dark) .badge-progress {
  color: var(--vscode-light-fg-subtle);
}

/* Loading and error states */
.loading-container, .error-container, .empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  gap: 12px;
  color: var(--vscode-fg-subtle);
  text-align: center;
}

.badge-manager:not(.dark) .loading-container,
.badge-manager:not(.dark) .error-container,
.badge-manager:not(.dark) .empty-container {
  color: var(--vscode-light-fg-subtle);
}

.loading-container.centered, 
.error-container.centered {
  height: 100%;
}

.loading-icon, .error-icon, .empty-icon {
  width: 24px;
  height: 24px;
}

.error-icon {
  color: var(--vscode-error);
}

.spin {
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.retry-button {
  background-color: var(--vscode-bg-lighter);
  border: 1px solid var(--vscode-border);
  color: var(--vscode-fg);
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.badge-manager:not(.dark) .retry-button {
  background-color: var(--vscode-light-bg-lighter);
  border: 1px solid var(--vscode-light-border);
  color: var(--vscode-light-fg);
}

.retry-button:hover {
  background-color: var(--vscode-hover);
}

.badge-manager:not(.dark) .retry-button:hover {
  background-color: var(--vscode-light-hover);
}

/* Main panel styles */
.main-panel {
  flex: 1;
  height: 100%;
  overflow-y: auto;
  padding: 24px;
  background-color: var(--vscode-bg);
}

.badge-manager:not(.dark) .main-panel {
  background-color: var(--vscode-light-bg);
}

.empty-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
  color: var(--vscode-fg-subtle);
  text-align: center;
}

.badge-manager:not(.dark) .empty-selection {
  color: var(--vscode-light-fg-subtle);
}

.empty-selection-icon {
  width: 48px;
  height: 48px;
  opacity: 0.7;
}

.create-button {
  background-color: var(--vscode-focus);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.create-button:hover {
  background-color: #0062a3;
}

.create-button:focus-visible {
  outline: 2px solid var(--vscode-focus);
  outline-offset: 2px;
}

/* Badge details styles */
.badge-details {
  max-width: 800px;
}

.badge-details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.badge-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.badge-actions {
  display: flex;
  gap: 8px;
}

.badge-description {
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 24px;
  color: var(--vscode-fg);
}

.badge-manager:not(.dark) .badge-description {
  color: var(--vscode-light-fg);
}

.badge-dates {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.date-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--vscode-fg-subtle);
}

.badge-manager:not(.dark) .date-item {
  color: var(--vscode-light-fg-subtle);
}

.date-icon {
  width: 16px;
  height: 16px;
}

.progress-container {
  margin-bottom: 24px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.progress-bar {
  height: 8px;
  background-color: var(--vscode-bg-lighter);
  border-radius: 4px;
  overflow: hidden;
}

.badge-manager:not(.dark) .progress-bar {
  background-color: var(--vscode-light-bg-lighter);
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-started {
  background-color: var(--vscode-progress-blue);
}

.progress-halfway {
  background-color: var(--vscode-progress-yellow);
}

.progress-complete {
  background-color: var(--vscode-success);
}

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

.badge-content {
  margin-top: 24px;
}

.badge-content h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.content-box {
  background-color: var(--vscode-bg-lighter);
  border: 1px solid var(--vscode-border);
  border-radius: 4px;
  padding: 16px;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
}

.badge-manager:not(.dark) .content-box {
  background-color: var(--vscode-light-bg-lighter);
  border: 1px solid var(--vscode-light-border);
}

/* Modal styles */
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

.badge-manager:not(.dark) .modal-content {
  background-color: var(--vscode-light-bg-light);
  border: 1px solid var(--vscode-light-border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--vscode-border);
}

.badge-manager:not(.dark) .modal-header {
  border-bottom: 1px solid var(--vscode-light-border);
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

.badge-manager:not(.dark) .close-button {
  color: var(--vscode-light-fg-subtle);
}

.close-button:hover {
  background-color: var(--vscode-hover);
  color: var(--vscode-fg);
}

.badge-manager:not(.dark) .close-button:hover {
  background-color: var(--vscode-light-hover);
  color: var(--vscode-light-fg);
}

/* Form styles */
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

.badge-manager:not(.dark) .form-input,
.badge-manager:not(.dark) .form-textarea {
  background-color: var(--vscode-light-bg-lighter);
  border: 1px solid var(--vscode-light-border);
  color: var(--vscode-light-fg);
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

.badge-manager:not(.dark) .remove-requirement-button {
  color: var(--vscode-light-fg-subtle);
}

.remove-requirement-button:hover {
  background-color: rgba(241, 76, 76, 0.2);
  color: var(--vscode-error);
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

.badge-manager:not(.dark) .add-requirement-button {
  border: 1px solid var(--vscode-light-border);
  color: var(--vscode-light-fg);
}

.add-requirement-button:hover {
  background-color: var(--vscode-hover);
}

.badge-manager:not(.dark) .add-requirement-button:hover {
  background-color: var(--vscode-light-hover);
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

.badge-manager:not(.dark) .cancel-button {
  border: 1px solid var(--vscode-light-border);
  color: var(--vscode-light-fg);
}

.cancel-button:hover {
  background-color: var(--vscode-hover);
}

.badge-manager:not(.dark) .cancel-button:hover {
  background-color: var(--vscode-light-hover);
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

.submit-button:hover {
  background-color: #0062a3;
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Delete modal */
.delete-modal {
  max-width: 400px;
}

.delete-content {
  padding: 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.delete-icon {
  width: 32px;
  height: 32px;
  color: var(--vscode-warning);
}

.delete-warning {
  color: var(--vscode-error);
  font-size: 13px;
  margin-top: 8px;
}

.delete-button {
  background-color: var(--vscode-error);
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

.delete-button:hover {
  background-color: #d13838;
}

.delete-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Responsive styles */
@media (max-width: 768px) {
  .badge-manager-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: auto;
    max-height: 40vh;
    border-right: none;
    border-bottom: 1px solid var(--vscode-border);
  }
  
  .badge-manager:not(.dark) .sidebar {
    border-bottom: 1px solid var(--vscode-light-border);
  }
  
  .main-panel {
    padding: 16px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 16px;
  }
}

/* Focus styles for accessibility */
:focus-visible {
  outline: 2px solid var(--vscode-focus);
  outline-offset: 2px;
}
</style>