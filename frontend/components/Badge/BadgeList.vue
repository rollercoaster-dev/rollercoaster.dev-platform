<script setup lang="ts">
import { computed, ref } from 'vue';
import { Badge as BadgeType, BadgeStatus } from '../../types/badge';
import BadgeCard from './BadgeCard.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus as PlusIcon, 
  Search as SearchIcon,
  X as XIcon,
  ChevronDown as ChevronDownIcon 
} from 'lucide-vue-next';

interface Props {
  badges: BadgeType[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
});

const emit = defineEmits<{
  (e: 'view', id: string): void;
  (e: 'edit', id: string): void;
  (e: 'delete', id: string): void;
  (e: 'create'): void;
}>();

// Search and filtering
const searchQuery = ref('');
const statusFilter = ref<BadgeStatus | 'ALL'>('ALL');

const filteredBadges = computed(() => {
  return props.badges.filter(badge => {
    // Apply search filter
    const matchesSearch = searchQuery.value 
      ? badge.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
        badge.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
      : true;

    // Apply status filter
    const matchesStatus = statusFilter.value === 'ALL' || badge.status === statusFilter.value;

    return matchesSearch && matchesStatus;
  });
});

// Sort options
const sortOptions = [
  { label: 'Name (A-Z)', value: 'name-asc' },
  { label: 'Name (Z-A)', value: 'name-desc' },
  { label: 'Progress (High-Low)', value: 'progress-desc' },
  { label: 'Progress (Low-High)', value: 'progress-asc' },
  { label: 'Recently Updated', value: 'updated-desc' },
];

const sortBy = ref(sortOptions[0].value);

const sortedBadges = computed(() => {
  return [...filteredBadges.value].sort((a, b) => {
    switch (sortBy.value) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'progress-desc':
        return b.progress - a.progress;
      case 'progress-asc':
        return a.progress - b.progress;
      case 'updated-desc':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      default:
        return 0;
    }
  });
});

const clearSearch = () => {
  searchQuery.value = '';
};

// Event handlers
const handleView = (id: string) => {
  emit('view', id);
};

const handleEdit = (id: string) => {
  emit('edit', id);
};

const handleDelete = (id: string) => {
  emit('delete', id);
};

const handleCreate = () => {
  emit('create');
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header with Actions -->
    <div class="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
      <h1 class="text-2xl font-bold">My Badges</h1>
      <Button @click="handleCreate" class="shrink-0">
        <PlusIcon class="h-4 w-4 mr-2" />
        Create Badge
      </Button>
    </div>

    <!-- Search and filters -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <SearchIcon class="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          v-model="searchQuery"
          placeholder="Search badges..."
          class="pl-10 pr-10"
          type="search"
        />
        <button 
          v-if="searchQuery"
          @click="clearSearch"
          class="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
        >
          <XIcon class="h-4 w-4" />
        </button>
      </div>

      <select
        v-model="statusFilter"
        class="px-4 py-2 rounded-md bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
      >
        <option value="ALL">All Statuses</option>
        <option :value="BadgeStatus.NOT_STARTED">Not Started</option>
        <option :value="BadgeStatus.IN_PROGRESS">In Progress</option>
        <option :value="BadgeStatus.COMPLETED">Completed</option>
        <option :value="BadgeStatus.ARCHIVED">Archived</option>
      </select>

      <select
        v-model="sortBy"
        class="px-4 py-2 rounded-md bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
      >
        <option v-for="option in sortOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>

    <!-- Badge Grid -->
    <div v-if="props.loading">
      <div class="text-center py-10">
        <div class="spinner h-8 w-8 border-4 border-t-primary rounded-full animate-spin mx-auto"></div>
        <p class="mt-4 text-muted-foreground">Loading badges...</p>
      </div>
    </div>
    
    <div v-else-if="sortedBadges.length === 0" class="text-center py-10">
      <p class="text-muted-foreground">No badges found. Create your first badge to get started!</p>
      <Button @click="handleCreate" variant="outline" class="mt-4">
        <PlusIcon class="h-4 w-4 mr-2" />
        Create Badge
      </Button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <BadgeCard
        v-for="badge in sortedBadges"
        :key="badge.id"
        :badge="badge"
        @view="handleView"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>
  </div>
</template>