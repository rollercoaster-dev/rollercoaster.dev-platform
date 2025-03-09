<template>
  <div class="badge-overview">
    <div class="overview-header">
      <h1 class="badge-title">{{ badge.name }}</h1>
      <div class="header-actions">
        <button 
          class="action-button edit-button"
          @click="$emit('edit')"
          aria-label="Edit badge"
        >
          <EditIcon class="action-icon" />
          <span>Edit</span>
        </button>
        <button 
          class="action-button delete-button"
          @click="$emit('delete')"
          aria-label="Delete badge"
        >
          <TrashIcon class="action-icon" />
          <span>Delete</span>
        </button>
      </div>
    </div>
    
    <div class="badge-description">
      {{ badge.description }}
    </div>
    
    <div class="badge-progress-section">
      <h2 class="section-title">Progress</h2>
      <div class="progress-bar-container">
        <div class="progress-percentage">{{ badge.progress }}%</div>
        <div class="progress-bar">
          <div 
            class="progress-fill"
            :class="getProgressClass(badge.progress)"
            :style="{ width: `${badge.progress}%` }"
          ></div>
        </div>
      </div>
      
      <div class="progress-details">
        <div class="progress-item">
          <CheckCircleIcon class="progress-icon completed" />
          <span>{{ completedRequirements }} completed</span>
        </div>
        <div class="progress-item">
          <CircleIcon class="progress-icon pending" />
          <span>{{ pendingRequirements }} pending</span>
        </div>
      </div>
    </div>
    
    <div class="badge-dates">
      <h2 class="section-title">Timeline</h2>
      <div class="dates-container">
        <div v-if="badge.startDate" class="date-item">
          <CalendarIcon class="date-icon" />
          <div class="date-info">
            <div class="date-label">Start Date</div>
            <div class="date-value">{{ formatDate(badge.startDate) }}</div>
          </div>
        </div>
        
        <div v-if="badge.targetDate" class="date-item">
          <TargetIcon class="date-icon" />
          <div class="date-info">
            <div class="date-label">Target Date</div>
            <div class="date-value">{{ formatDate(badge.targetDate) }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="badge.requirements.length > 0" class="badge-requirements">
      <h2 class="section-title">Requirements</h2>
      <ul class="requirements-list">
        <li 
          v-for="req in badge.requirements" 
          :key="req.id"
          class="requirement-item"
          :class="{ 'completed': req.completed }"
        >
          <CheckSquareIcon v-if="req.completed" class="requirement-check completed" />
          <SquareIcon v-else class="requirement-check" />
          <span class="requirement-text">{{ req.description }}</span>
        </li>
      </ul>
    </div>
    
    <div v-if="badge.content" class="badge-content">
      <h2 class="section-title">Content</h2>
      <div class="content-box">
        {{ badge.content }}
      </div>
    </div>
    
    <div class="badge-metadata">
      <div class="metadata-item">
        <ClockIcon class="metadata-icon" />
        <span>Created: {{ formatDate(badge.createdAt) }}</span>
      </div>
      <div class="metadata-item">
        <RefreshCwIcon class="metadata-icon" />
        <span>Last updated: {{ formatDate(badge.updatedAt) }}</span>
      </div>
      <div v-if="badge.externalId" class="metadata-item">
        <LinkIcon class="metadata-icon" />
        <span>External ID: {{ badge.externalId }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { 
  Edit as EditIcon,
  Trash as TrashIcon,
  Calendar as CalendarIcon,
  Target as TargetIcon,
  CheckSquare as CheckSquareIcon,
  Square as SquareIcon,
  CheckCircle as CheckCircleIcon,
  Circle as CircleIcon,
  Clock as ClockIcon,
  RefreshCw as RefreshCwIcon,
  Link as LinkIcon
} from 'lucide-vue-next';
import type { Badge } from '../../types/badge';

// Props
interface Props {
  badge: Badge;
}

const props = defineProps<Props>();

// Computed
const completedRequirements = computed(() => 
  props.badge.requirements.filter(req => req.completed).length
);

const pendingRequirements = computed(() => 
  props.badge.requirements.length - completedRequirements.value
);

// Methods
const getProgressClass = (progress: number) => {
  if (progress >= 100) return 'complete';
  if (progress >= 50) return 'halfway';
  return 'started';
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

defineEmits<{
  (e: 'edit'): void
  (e: 'delete'): void
}>();
</script>

<style scoped>
.badge-overview {
  max-width: 800px;
  margin: 0 auto;
}

.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.badge-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--title-color, #ffffff);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.action-button {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 4px;
  background-color: transparent;
  font-size: 13px;
  cursor: pointer;
  border: 1px solid var(--button-border, #3a3a3a);
  transition: background-color 0.2s;
}

.edit-button {
  color: var(--edit-button-color, #0e639c);
}

.edit-button:hover {
  background-color: var(--edit-button-hover, rgba(14, 99, 156, 0.1));
}

.delete-button {
  color: var(--delete-button-color, #cc3e3e);
}

.delete-button:hover {
  background-color: var(--delete-button-hover, rgba(204, 62, 62, 0.1));
}

.action-icon {
  width: 14px;
  height: 14px;
  margin-right: 6px;
}

.badge-description {
  font-size: 16px;
  line-height: 1.5;
  color: var(--description-color, #d4d4d4);
  margin-bottom: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--section-title-color, #d4d4d4);
  margin: 0 0 12px 0;
}

.badge-progress-section {
  margin-bottom: 24px;
}

.progress-bar-container {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.progress-percentage {
  font-size: 18px;
  font-weight: 600;
  color: var(--progress-text, #d4d4d4);
  width: 50px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background-color: var(--progress-bg, #3a3a3a);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
}

.progress-fill.started {
  background-color: var(--progress-started, #3b82f6);
}

.progress-fill.halfway {
  background-color: var(--progress-halfway, #3b82f6);
}

.progress-fill.complete {
  background-color: var(--progress-complete, #22c55e);
}

.progress-details {
  display: flex;
  gap: 16px;
}

.progress-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--details-text, #9d9d9d);
}

.progress-icon {
  width: 16px;
  height: 16px;
}

.progress-icon.completed {
  color: var(--completed-color, #22c55e);
}

.progress-icon.pending {
  color: var(--pending-color, #9d9d9d);
}

.badge-dates {
  margin-bottom: 24px;
}

.dates-container {
  display: flex;
  gap: 24px;
}

.date-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-icon {
  width: 18px;
  height: 18px;
  color: var(--date-icon-color, #0e639c);
}

.date-info {
  display: flex;
  flex-direction: column;
}

.date-label {
  font-size: 12px;
  color: var(--date-label-color, #9d9d9d);
}

.date-value {
  font-size: 14px;
  color: var(--date-value-color, #d4d4d4);
}

.badge-requirements {
  margin-bottom: 24px;
}

.requirements-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.requirement-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px solid var(--item-border, #333333);
}

.requirement-item:last-child {
  border-bottom: none;
}

.requirement-check {
  width: 18px;
  height: 18px;
  color: var(--check-color, #9d9d9d);
}

.requirement-check.completed {
  color: var(--completed-color, #22c55e);
}

.requirement-text {
  font-size: 14px;
  color: var(--requirement-text, #d4d4d4);
}

.requirement-item.completed .requirement-text {
  text-decoration: line-through;
  color: var(--completed-text, #757575);
}

.badge-content {
  margin-bottom: 24px;
}

.content-box {
  padding: 16px;
  background-color: var(--content-bg, #272727);
  border: 1px solid var(--content-border, #333333);
  border-radius: 4px;
  white-space: pre-wrap;
  font-size: 14px;
  color: var(--content-text, #d4d4d4);
  line-height: 1.5;
}

.badge-metadata {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--metadata-border, #333333);
}

.metadata-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--metadata-text, #9d9d9d);
}

.metadata-icon {
  width: 14px;
  height: 14px;
  color: var(--metadata-icon, #9d9d9d);
}
</style>