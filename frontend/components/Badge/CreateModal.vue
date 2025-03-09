<script setup lang="ts">
import { Badge, CreateBadgeDto } from '../../types/badge';

// Define props and emits
interface Props {
  badge?: Badge;
  isLoading?: boolean;
  isOpen?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  badge: undefined,
  isLoading: false,
  isOpen: false
});

const emit = defineEmits<{
  (e: 'submit', badge: CreateBadgeDto | Partial<Badge>): void;
  (e: 'cancel'): void;
  (e: 'update:isOpen', value: boolean): void;
}>();

// Form submission handler
const handleSubmit = (badgeData: CreateBadgeDto | Partial<Badge>) => {
  emit('submit', badgeData);
};

// Cancel handler
const handleCancel = () => {
  emit('cancel');
  emit('update:isOpen', false);
};

// Close the modal
const closeModal = () => {
  emit('update:isOpen', false);
};
</script>

<template>
  <div v-if="isOpen" class="modal-wrapper">
    <div class="modal-backdrop" @click="closeModal"></div>
    <div class="modal-container">
      <div class="modal-header">
        <h2 class="modal-title">{{ badge ? 'Edit Badge' : 'Create Badge' }}</h2>
        <button class="modal-close" @click="closeModal" aria-label="Close">
          <span class="material-icons">close</span>
        </button>
      </div>
      <div class="modal-content">
        <BadgeForm 
          :badge="badge" 
          :is-loading="isLoading"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
}

.modal-container {
  position: relative;
  max-width: 650px;
  width: 90%;
  max-height: 90vh;
  background-color: var(--editor-content-bg);
  border-radius: 6px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1001;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--explorer-border-color);
}

.modal-title {
  font-size: 1.25rem;
  margin: 0;
  color: var(--title-color);
}

.modal-close {
  background: none;
  border: none;
  color: var(--explorer-subtle-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
}

.modal-close:hover {
  background-color: var(--explorer-hover-bg);
  color: var(--explorer-hover-color);
}

.modal-content {
  padding: 0;
  overflow-y: auto;
  max-height: calc(90vh - 70px);
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