<script setup lang="ts">
import { computed } from 'vue';
import { Badge, BadgeStatus } from '../../types/badge';

interface Props {
  badge: Badge;
  compact?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  compact: false
});

const emit = defineEmits<{
  (e: 'view', id: string): void;
  (e: 'edit', id: string): void;
  (e: 'delete', id: string): void;
}>();

// Computed properties
const progressClass = computed(() => {
  if (props.badge.progress >= 100) return 'complete';
  if (props.badge.progress >= 50) return 'halfway';
  if (props.badge.progress > 0) return 'started';
  return 'not-started';
});

const statusClass = computed(() => {
  return props.badge.status.toLowerCase().replace('_', '-');
});

const statusLabel = computed(() => {
  switch (props.badge.status) {
    case BadgeStatus.NOT_STARTED:
      return 'Not Started';
    case BadgeStatus.IN_PROGRESS:
      return 'In Progress';
    case BadgeStatus.COMPLETED:
      return 'Completed';
    default:
      return 'Unknown';
  }
});

const completedRequirements = computed(() => {
  return props.badge.requirements.filter(r => r.completed).length;
});

const totalRequirements = computed(() => {
  return props.badge.requirements.length;
});

const formattedDate = (dateString?: string) => {
  if (!dateString) return 'Not set';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

// Handle card actions
const handleView = () => {
  emit('view', props.badge.id);
};

const handleEdit = (event: Event) => {
  event.stopPropagation();
  emit('edit', props.badge.id);
};

const handleDelete = (event: Event) => {
  event.stopPropagation();
  emit('delete', props.badge.id);
};
</script>

<template>
  <div 
    class="badge-card" 
    :class="{ compact }"
    @click="handleView"
  >
    <div class="card-header">
      <div class="badge-info">
        <h3 class="badge-title">{{ badge.name }}</h3>
        <span class="badge-status" :class="statusClass">{{ statusLabel }}</span>
      </div>
      <div v-if="!compact" class="badge-actions">
        <button 
          class="action-button edit-button"
          @click="handleEdit"
          aria-label="Edit badge"
        >
          <span class="material-icons">edit</span>
        </button>
        <button 
          class="action-button delete-button"
          @click="handleDelete"
          aria-label="Delete badge"
        >
          <span class="material-icons">delete</span>
        </button>
      </div>
    </div>
    
    <p v-if="!compact" class="badge-description">{{ badge.description }}</p>
    
    <div class="progress-container">
      <div class="progress-bar">
        <div 
          class="progress-value" 
          :class="progressClass"
          :style="{ width: `${badge.progress}%` }"
        ></div>
      </div>
      <div class="progress-text">
        <span>{{ badge.progress }}%</span>
        <span v-if="!compact">{{ completedRequirements }}/{{ totalRequirements }} requirements</span>
      </div>
    </div>
    
    <div v-if="!compact" class="badge-footer">
      <div class="date-info">
        <div v-if="badge.startDate" class="date-item">
          <span class="material-icons date-icon">calendar_today</span>
          <span class="date-label">Started:</span>
          <span class="date-value">{{ formattedDate(badge.startDate) }}</span>
        </div>
        <div v-if="badge.targetDate" class="date-item">
          <span class="material-icons date-icon">event</span>
          <span class="date-label">Target:</span>
          <span class="date-value">{{ formattedDate(badge.targetDate) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.badge-card {
  background-color: var(--editor-content-bg);
  border: 1px solid var(--explorer-border-color);
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.badge-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.badge-card.compact {
  padding: 12px;
  margin-bottom: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.badge-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.badge-title {
  margin: 0;
  font-size: 1.1rem;
  color: var(--title-color);
}

.compact .badge-title {
  font-size: 0.95rem;
}

.badge-status {
  font-size: 0.75rem;
  padding: 3px 8px;
  border-radius: 12px;
  display: inline-block;
  font-weight: 500;
  margin-top: 4px;
  width: fit-content;
}

.badge-status.not-started {
  background-color: var(--status-not-started-bg);
  color: var(--status-not-started-text);
}

.badge-status.in-progress {
  background-color: var(--status-in-progress-bg);
  color: var(--status-in-progress-text);
}

.badge-status.completed {
  background-color: var(--status-completed-bg);
  color: var(--status-completed-text);
}

.badge-actions {
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

.badge-description {
  margin: 0 0 16px 0;
  font-size: 0.9rem;
  color: var(--description-color);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.progress-container {
  margin-bottom: 16px;
}

.compact .progress-container {
  margin-bottom: 4px;
}

.progress-bar {
  height: 6px;
  background-color: var(--progress-bg);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
}

.progress-value {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-value.not-started {
  background-color: var(--progress-bg);
}

.progress-value.started {
  background-color: var(--progress-started);
}

.progress-value.halfway {
  background-color: var(--progress-halfway);
}

.progress-value.complete {
  background-color: var(--progress-complete);
}

.progress-text {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--progress-text);
}

.compact .progress-text {
  justify-content: flex-end;
}

.badge-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  font-size: 0.8rem;
}

.date-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.date-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.date-icon {
  font-size: 14px;
  color: var(--date-icon-color);
}

.date-label {
  color: var(--date-label-color);
}

.date-value {
  color: var(--date-value-color);
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
</style>