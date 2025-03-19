<script setup lang="ts">
import { computed } from 'vue';
import { 
  Edit as EditIcon,
  Trash as TrashIcon,
  Calendar as CalendarIcon,
  Target as TargetIcon,
  CheckCircle as CheckCircleIcon,
  Circle as CircleIcon,
  Clock as ClockIcon,
  RefreshCw as RefreshCwIcon,
  Link as LinkIcon
} from 'lucide-vue-next';
import type { Badge } from '../../types/badge';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Badge as UiBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

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
  if (progress >= 100) return 'bg-success';
  if (progress >= 50) return 'bg-info';
  return 'bg-primary';
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const emit = defineEmits<{
  (e: 'edit'): void
  (e: 'delete'): void
  (e: 'toggleRequirement', id: string, completed: boolean): void
}>();

const handleToggleRequirement = (id: string, completed: boolean) => {
  emit('toggleRequirement', id, completed);
};
</script>

<template>
  <div class="space-y-6 max-w-3xl mx-auto">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold">{{ badge.name }}</h1>
      <div class="flex space-x-2">
        <Button variant="outline" @click="$emit('edit')">
          <EditIcon class="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button variant="destructive" @click="$emit('delete')">
          <TrashIcon class="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>

    <p class="text-lg text-muted-foreground">{{ badge.description }}</p>

    <Card>
      <CardHeader>
        <CardTitle>Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div class="flex items-center space-x-4">
            <span class="text-2xl font-bold">{{ badge.progress }}%</span>
            <Progress :value="badge.progress" class="flex-1" :indicatorClass="getProgressClass(badge.progress)" />
          </div>
          
          <div class="flex space-x-6">
            <div class="flex items-center space-x-2">
              <CheckCircleIcon class="h-5 w-5 text-success" />
              <span>{{ completedRequirements }} completed</span>
            </div>
            <div class="flex items-center space-x-2">
              <CircleIcon class="h-5 w-5 text-muted-foreground" />
              <span>{{ pendingRequirements }} pending</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card v-if="badge.startDate || badge.targetDate">
      <CardHeader>
        <CardTitle>Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-if="badge.startDate" class="flex items-center space-x-3">
            <div class="bg-primary/10 p-2 rounded-full">
              <CalendarIcon class="h-5 w-5 text-primary" />
            </div>
            <div>
              <div class="text-sm text-muted-foreground">Start Date</div>
              <div class="font-medium">{{ formatDate(badge.startDate) }}</div>
            </div>
          </div>

          <div v-if="badge.targetDate" class="flex items-center space-x-3">
            <div class="bg-primary/10 p-2 rounded-full">
              <TargetIcon class="h-5 w-5 text-primary" />
            </div>
            <div>
              <div class="text-sm text-muted-foreground">Target Date</div>
              <div class="font-medium">{{ formatDate(badge.targetDate) }}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card v-if="badge.requirements.length > 0">
      <CardHeader>
        <CardTitle>Requirements</CardTitle>
        <CardDescription>Complete all requirements to earn this badge</CardDescription>
      </CardHeader>
      <CardContent>
        <ul class="space-y-3">
          <li
            v-for="req in badge.requirements"
            :key="req.id"
            :class="cn(
              'flex items-start space-x-3 py-2 border-b last:border-0',
              req.completed ? 'text-muted-foreground' : ''
            )"
          >
            <Checkbox 
              :model-value="req.completed" 
              @update:model-value="handleToggleRequirement(req.id, $event)"
            />
            <span :class="{ 'line-through': req.completed }">{{ req.description }}</span>
          </li>
        </ul>
      </CardContent>
    </Card>

    <Card v-if="badge.content">
      <CardHeader>
        <CardTitle>Content</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="p-4 bg-muted rounded-md whitespace-pre-wrap text-sm">
          {{ badge.content }}
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Metadata</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div class="flex items-center space-x-2">
            <ClockIcon class="h-4 w-4 text-muted-foreground" />
            <span>Created: {{ formatDate(badge.createdAt) }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <RefreshCwIcon class="h-4 w-4 text-muted-foreground" />
            <span>Last updated: {{ formatDate(badge.updatedAt) }}</span>
          </div>
          <div v-if="badge.externalId" class="flex items-center space-x-2">
            <LinkIcon class="h-4 w-4 text-muted-foreground" />
            <span>External ID: {{ badge.externalId }}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>