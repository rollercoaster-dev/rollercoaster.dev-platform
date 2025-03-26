<template>
  <div 
    class="badge-manager"
    :class="{ 'dark': isDarkMode }"
    @keydown.ctrl.n.prevent="openModal('create')"
    @keydown.ctrl.e.prevent="selectedBadge && openModal('edit')"
    @keydown.ctrl.delete.prevent="selectedBadge && confirmDelete()"
    @keydown.esc.prevent="handleEscape"
    @keydown="trapFocus"
    role="application"
    aria-label="Badge Manager"
  >
    <div class="badge-manager-container">
      <!-- Sidebar -->
      <div class="sidebar">
        <BadgeList
          :badges="badges"
          :selected-badge-id="selectedBadgeId"
          :is-loading="isLoading"
          :error="error"
          :is-dark-mode="isDarkMode"
          @select="selectBadge"
          @create="openModal('create')"
          @toggle-theme="toggleDarkMode"
          @retry="loadBadges"
        />
      </div>

      <!-- Main Panel -->
      <div class="main-panel">
        <div v-if="!selectedBadge" class="empty-selection">
          <AwardIcon class="empty-selection-icon" />
          <h2>Select a badge to view details</h2>
          <button 
            class="create-button" 
            @click="openModal('create')"
          >
            Create New Badge
          </button>
        </div>

        <BadgeDetails
          v-else
          :badge="selectedBadge"
          :is-loading="selectedBadgeLoading"
          :error="selectedBadgeError"
          @edit="openModal('edit')"
          @delete="confirmDelete"
          @retry="loadSelectedBadge"
          @toggle-requirement="toggleRequirement"
        />
      </div>
    </div>

    <!-- Modals -->
    <CreateBadgeModal 
      v-if="showCreateModal"
      :is-submitting="isCreating"
      @close="closeModal('create')"
      @submit="createNewBadge"
    />

    <EditBadgeModal
      v-if="showEditModal && selectedBadge"
      :badge="selectedBadge"
      :is-submitting="isUpdating"
      @close="closeModal('edit')"
      @submit="updateExistingBadge"
    />

    <DeleteConfirmationModal
      v-if="showDeleteModal && selectedBadge"
      :badge-name="selectedBadge.name"
      :is-deleting="isDeleting"
      @close="closeModal('delete')"
      @confirm="deleteBadgeConfirmed"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { badgeService } from '../../frontend/services/badgeService';
import { BadgeStatus } from '@atbadges/shared';
import type { 
  Badge, 
  BadgeRequirement,
  CreateBadgeDto,
  UpdateBadgeProgressDto
} from '../../shared/types/badge';
import { 
  Award as AwardIcon,
  Calendar as CalendarIcon,
  Target as TargetIcon
} from 'lucide-vue-next';
import BadgeList from '../components/badges/BadgeList.vue';
import BadgeDetails from '../components/badges/BadgeDetails.vue';
import CreateBadgeModal from '../components/badges/CreateBadgeModal.vue';
import EditBadgeModal from '../components/badges/EditBadgeModal.vue';
import DeleteConfirmationModal from '../components/badges/DeleteConfirmationModal.vue';
import '../assets/css/editor-theme.css'

// State
const badges = ref<Badge[]>([]);
const selectedBadgeId = ref<string | null>(null);
const selectedBadge = ref<Badge | null>(null);
const searchQuery = ref('');
const isLoading = ref(false);
const error = ref<string | null>(null);
const selectedBadgeLoading = ref(false);
const selectedBadgeError = ref<string | null>(null);
const isDarkMode = ref(true);

// Modal state
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);

// Form state
const newBadge = ref<Omit<CreateBadgeDto, 'progress' | 'status'>>({
  name: '',
  description: '',
  content: '',
  startDate: '',
  targetDate: '',
  requirements: [{ id: crypto.randomUUID(), description: '', completed: false }]
});

const editBadge = ref<Partial<Badge>>({
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

// Focus management
const lastFocusedElement = ref<HTMLElement | null>(null);

const trapFocus = (e: KeyboardEvent) => {
  if (!e.target || !(e.target instanceof HTMLElement)) return;
  
  const modal = e.target.closest('.modal-content');
  if (!modal) return;
  
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0] as HTMLElement;
  const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  if (e.key === 'Tab') {
    if (e.shiftKey && document.activeElement === firstFocusable) {
      e.preventDefault();
      lastFocusable.focus();
    } else if (!e.shiftKey && document.activeElement === lastFocusable) {
      e.preventDefault();
      firstFocusable.focus();
    }
  }
};

const openModal = (modalType: 'create' | 'edit' | 'delete') => {
  lastFocusedElement.value = document.activeElement as HTMLElement;
  if (modalType === 'create') showCreateModal.value = true;
  else if (modalType === 'edit') showEditModal.value = true;
  else if (modalType === 'delete') showDeleteModal.value = true;
};

const closeModal = (modalType: 'create' | 'edit' | 'delete') => {
  if (modalType === 'create') showCreateModal.value = false;
  else if (modalType === 'edit') showEditModal.value = false;
  else if (modalType === 'delete') showDeleteModal.value = false;
  
  // Return focus to the element that was focused before opening the modal
  if (lastFocusedElement.value) {
    lastFocusedElement.value.focus();
    lastFocusedElement.value = null;
  }
};

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
const loadBadges = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    badges.value = await badgeService.getBadges();
  } catch (err) {
    error.value = 'Failed to load badges. Please try again.';
    console.error('Error loading badges:', err);
  } finally {
    isLoading.value = false;
  }
};

const loadSelectedBadge = async () => {
  if (!selectedBadgeId.value) return;
  
  selectedBadgeLoading.value = true;
  selectedBadgeError.value = null;
  
  try {
    selectedBadge.value = await badgeService.getBadgeById(selectedBadgeId.value);
  } catch (err) {
    selectedBadgeError.value = 'Failed to load badge details. Please try again.';
    console.error('Error loading badge details:', err);
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
  isCreating.value = true;
  
  try {
    const createBadgeDto: CreateBadgeDto = {
      ...newBadge.value,
      progress: 0,
      status: BadgeStatus.NOT_STARTED,
      requirements: newBadge.value.requirements.map((req: { description: string; completed: boolean }) => ({
        id: crypto.randomUUID(),
        description: req.description,
        completed: false
      }))
    };
    
    const createdBadge = await badgeService.createBadge(createBadgeDto);
    badges.value.push(createdBadge);
    showCreateModal.value = false;
    
    // Reset form
    newBadge.value = {
      name: '',
      description: '',
      content: '',
      startDate: '',
      targetDate: '',
      requirements: [{ id: crypto.randomUUID(), description: '', completed: false }]
    };
    
    // Select the newly created badge
    selectedBadgeId.value = createdBadge.id;
  } catch (err) {
    console.error('Error creating badge:', err);
    alert('Failed to create badge. Please try again.');
  } finally {
    isCreating.value = false;
  }
};

const updateExistingBadge = async () => {
  if (!selectedBadge.value) return;
  
  isUpdating.value = true;
  
  try {
    const updateBadgeDto: Partial<Badge> = {
      name: editBadge.value.name,
      description: editBadge.value.description,
      content: editBadge.value.content,
      startDate: editBadge.value.startDate,
      targetDate: editBadge.value.targetDate,
      requirements: editBadge.value.requirements?.map((req: { id?: string; description: string; completed: boolean }) => ({
        id: req.id || crypto.randomUUID(),
        description: req.description,
        completed: req.completed
      }))
    };
    
    const updatedBadge = await badgeService.updateBadge(selectedBadge.value.id, updateBadgeDto);
    
    // Update local state
    const index = badges.value.findIndex((b: Badge) => b.id === updatedBadge.id);
    if (index !== -1) {
      badges.value[index] = updatedBadge;
    }
    
    selectedBadge.value = updatedBadge;
    showEditModal.value = false;
  } catch (err) {
    console.error('Error updating badge:', err);
    alert('Failed to update badge. Please try again.');
  } finally {
    isUpdating.value = false;
  }
};

const toggleRequirement = async (reqId: string, completed: boolean) => {
  if (!selectedBadge.value) return;
  
  try {
    // Find the requirement
    const requirement = selectedBadge.value.requirements.find((r: BadgeRequirement) => r.id === reqId);
    if (!requirement) return;
    
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
    
    // Update progress on server
    const progressData: UpdateBadgeProgressDto = {
      progress: newProgress,
      requirements: selectedBadge.value.requirements.map((r: BadgeRequirement) => ({
        id: r.id,
        completed: r.completed
      }))
    };
    
    const updatedBadge = await badgeService.updateBadgeProgress(
      selectedBadge.value.id, 
      progressData
    );
    
    // Update local state
    selectedBadge.value = updatedBadge;
    
    // Update badge in list
    const index = badges.value.findIndex((b: Badge) => b.id === updatedBadge.id);
    if (index !== -1) {
      badges.value[index] = updatedBadge;
    }
  } catch (err) {
    console.error('Error updating requirement:', err);
    alert('Failed to update requirement. Please try again.');
    
    // Revert the change locally
    loadSelectedBadge();
  }
};

const confirmDelete = () => {
  openModal('delete');
};

const deleteBadgeConfirmed = async () => {
  if (!selectedBadge.value) return;
  
  isDeleting.value = true;
  
  try {
    await badgeService.deleteBadge(selectedBadge.value.id);
    
    // Update local state
    badges.value = badges.value.filter(b => b.id !== selectedBadge.value?.id);
    selectedBadgeId.value = null;
    selectedBadge.value = null;
    showDeleteModal.value = false;
  } catch (err) {
    console.error('Error deleting badge:', err);
    alert('Failed to delete badge. Please try again.');
  } finally {
    isDeleting.value = false;
  }
};

// Form helpers
const addRequirement = () => {
  newBadge.value.requirements.push({ 
    id: crypto.randomUUID(),
    description: '', 
    completed: false 
  });
};

const removeRequirement = (index: number) => {
  if (newBadge.value.requirements.length > 1) {
    newBadge.value.requirements.splice(index, 1);
  }
};

const addEditRequirement = () => {
  if (editBadge.value.requirements) {
    editBadge.value.requirements.push({ 
      id: crypto.randomUUID(),
      description: '', 
      completed: false 
    });
  }
};

const removeEditRequirement = (index: number) => {
  if (editBadge.value.requirements && editBadge.value.requirements.length > 1) {
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
      requirements: selectedBadge.value.requirements.map((req: BadgeRequirement) => ({
        id: req.id,
        description: req.description,
        completed: req.completed
      }))
    };
  }
});

const handleEscape = () => {
  if (showDeleteModal.value) {
    showDeleteModal.value = false;
  } else if (showEditModal.value) {
    showEditModal.value = false;
  } else if (showCreateModal.value) {
    showCreateModal.value = false;
  }
};

const selectPreviousBadge = (currentId: string) => {
  const currentIndex = badges.value.findIndex(b => b.id === currentId);
  if (currentIndex > 0) {
    selectBadge(badges.value[currentIndex - 1].id);
  }
};

const selectNextBadge = (currentId: string) => {
  const currentIndex = badges.value.findIndex(b => b.id === currentId);
  if (currentIndex < badges.value.length - 1) {
    selectBadge(badges.value[currentIndex + 1].id);
  }
};
</script>

<style>
/* Import the editor theme */
@import '../assets/css/editor-theme.css';

/* Empty selection styles */
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
</style>