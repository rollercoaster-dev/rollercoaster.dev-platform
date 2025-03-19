<script setup lang="ts">
import { computed } from 'vue';
import { Badge, BadgeStatus } from '../../types/badge';
import { cn } from '@/lib/utils';
import { CalendarIcon, CheckCircleIcon, PencilIcon, TrashIcon, CircleIcon, Clock } from 'lucide-vue-next';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge as UiBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

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
  if (props.badge.progress >= 100) return 'bg-success';
  if (props.badge.progress >= 50) return 'bg-info';
  if (props.badge.progress > 0) return 'bg-primary';
  return 'bg-muted';
});

const statusVariant = computed(() => {
  switch (props.badge.status) {
    case BadgeStatus.NOT_STARTED:
      return 'secondary';
    case BadgeStatus.IN_PROGRESS:
      return 'info';
    case BadgeStatus.COMPLETED:
      return 'success';
    case BadgeStatus.ARCHIVED:
      return 'outline';
    default:
      return 'secondary';
  }
});

const statusLabel = computed(() => {
  switch (props.badge.status) {
    case BadgeStatus.NOT_STARTED:
      return 'Not Started';
    case BadgeStatus.IN_PROGRESS:
      return 'In Progress';
    case BadgeStatus.COMPLETED:
      return 'Completed';
    case BadgeStatus.ARCHIVED:
      return 'Archived';
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
  <Card 
    @click="handleView" 
    :class="cn('cursor-pointer transition-all hover:shadow-md hover:-translate-y-1', compact ? 'p-3' : 'p-4')"
  >
    <CardHeader :class="cn('pb-2', compact ? 'px-3 py-2' : 'px-4 py-3')">
      <div class="flex justify-between items-start">
        <div class="space-y-1">
          <CardTitle :class="compact ? 'text-base' : 'text-xl'">{{ badge.name }}</CardTitle>
          <UiBadge :variant="statusVariant">{{ statusLabel }}</UiBadge>
        </div>
        <div v-if="!compact" class="flex space-x-2">
          <Button variant="ghost" size="icon" @click="handleEdit" aria-label="Edit badge">
            <PencilIcon class="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" @click="handleDelete" aria-label="Delete badge">
            <TrashIcon class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardHeader>

    <CardContent :class="compact ? 'px-3 py-2' : 'px-4 py-3'">
      <p v-if="!compact" class="text-sm text-muted-foreground mb-4 line-clamp-2">
        {{ badge.description }}
      </p>

      <div class="space-y-2">
        <Progress :value="badge.progress" :indicatorClass="progressClass" />
        <div class="flex justify-between items-center text-sm">
          <span class="font-medium">{{ badge.progress }}%</span>
          <span v-if="!compact" class="text-muted-foreground">{{ completedRequirements }}/{{ totalRequirements }} requirements</span>
        </div>
      </div>
    </CardContent>

    <CardFooter v-if="!compact" :class="'px-4 py-3 flex flex-col space-y-2 text-sm text-muted-foreground'">
      <div v-if="badge.startDate" class="flex items-center space-x-2">
        <CalendarIcon class="h-4 w-4" />
        <span>Started: {{ formattedDate(badge.startDate) }}</span>
      </div>
      <div v-if="badge.targetDate" class="flex items-center space-x-2">
        <Clock class="h-4 w-4" />
        <span>Target: {{ formattedDate(badge.targetDate) }}</span>
      </div>
    </CardFooter>
  </Card>
</template>