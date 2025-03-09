<script setup lang="ts">
import { Badge } from '../../types/badge';

interface Props {
  badges: Badge[];
  isLoading?: boolean;
  error?: string | null;
  compact?: boolean;
  showCreateButton?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  error: null,
  compact: false,
  showCreateButton: true
});

const emit = defineEmits<{
  (e: 'view', id: string): void;
  (e: 'edit', id: string): void;
  (e: 'delete', id: string): void;
  (e: 'createNew'): void;
  (e: 'retry'): void;
}>();

// Handle badge actions
const handleView = (id: string) => {
  emit('view', id);
};

const handleEdit = (id: string) => {
  emit('edit', id);
};

const handleDelete = (id: string) => {
  emit('delete', id);
};

const handleCreateNew = () => {
  emit('createNew');
};

const handleRetry = () => {
  emit('retry');
};
</script>

<template>
  <div class="badge-list">
    <!-- Loading State -->
    <div v-if="isLoading" class="badge-list-state loading">
      <span class="material-icons loading-icon">sync</span>
      <p>Loading badges...</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="badge-list-state error">
      <span class="material-icons error-icon">error_outline</span>
      <p>{{ error }}</p>
      <button class="retry-button" @click="handleRetry">Try Again</button>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="badges.length === 0" class="badge-list-state empty">
      <span class="material-icons empty-icon">emoji_events</span>
      <p>No badges found.</p>
      <button 
        v-if="showCreateButton"
        class="create-button" 
        @click="handleCreateNew"
      >
        Create Your First Badge
      </button>
    </div>
    
    <!-- Badges List -->
    <template v-else>
      <div class="list-header" v-if="showCreateButton">
        <h2 class="list-title">Your Badges</h2>
        <button class="create-button" @click="handleCreateNew">
          <span class="material-icons">add</span>
          Create New Badge
        </button>
      </div>
      
      <div class="badges-container" :class="{ compact }">
        <BadgeCard
          v-for="badge in badges"
          :key="badge.id"
          :badge="badge"
          :compact="compact"
          @view="handleView"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.badge-list {
  padding: 16px;
  height: 100%;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.list-title {
  margin: 0;
  font-size: 1.25rem;
  color: var(--title-color);
}

.badges-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  grid-gap: 16px;
}

.badges-container.compact {
  display: flex;
  flex-direction: column;
}

.badge-list-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  min-height: 200px;
  color: var(--explorer-subtle-color);
}

.badge-list-state p {
  margin: 12px 0;
}

.loading-icon {
  font-size: 32px;
  animation: spin 1.5s linear infinite;
}

.error-icon, .empty-icon {
  font-size: 32px;
}

.error-icon {
  color: var(--explorer-error-color);
}

.retry-button, .create-button {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  background-color: var(--button-bg);
  color: var(--button-text);
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.retry-button:hover, .create-button:hover {
  background-color: var(--button-hover-bg);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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