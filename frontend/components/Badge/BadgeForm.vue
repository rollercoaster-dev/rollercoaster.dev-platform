<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { 
  Badge, 
  BadgeStatus, 
  BadgeRequirement, 
  CreateBadgeDto, 
  UpdateBadgeDto 
} from '../../types/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus as PlusIcon, 
  X as XIcon, 
  GripVertical as GripIcon 
} from 'lucide-vue-next';

interface Props {
  badge?: Badge;
  isEditing?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isEditing: false
});

const emit = defineEmits<{
  (e: 'save', badge: CreateBadgeDto | UpdateBadgeDto): void;
  (e: 'cancel'): void;
}>();

// Form data
const name = ref('');
const description = ref('');
const content = ref('');
const status = ref<BadgeStatus>(BadgeStatus.NOT_STARTED);
const startDate = ref('');
const targetDate = ref('');
const requirements = ref<BadgeRequirement[]>([]);

// Initialize form data
onMounted(() => {
  if (props.badge) {
    name.value = props.badge.name;
    description.value = props.badge.description;
    content.value = props.badge.content || '';
    status.value = props.badge.status;
    startDate.value = props.badge.startDate || '';
    targetDate.value = props.badge.targetDate || '';
    requirements.value = [...props.badge.requirements];
  } else {
    // Initialize with one empty requirement
    addRequirement();
  }
});

// Requirement management
const addRequirement = () => {
  requirements.value.push({
    id: uuidv4(),
    description: '',
    completed: false
  });
};

const removeRequirement = (index: number) => {
  requirements.value.splice(index, 1);
};

// Validation
const isValid = computed(() => {
  return (
    name.value.trim() !== '' &&
    description.value.trim() !== '' &&
    requirements.value.length > 0 &&
    requirements.value.every(req => req.description.trim() !== '')
  );
});

// Form submission
const handleSubmit = () => {
  if (!isValid.value) return;

  const formData: CreateBadgeDto | UpdateBadgeDto = {
    name: name.value.trim(),
    description: description.value.trim(),
    content: content.value.trim() || undefined,
    status: status.value,
    requirements: requirements.value.map(req => ({
      id: req.id,
      description: req.description.trim(),
      completed: req.completed
    })),
    startDate: startDate.value || undefined,
    targetDate: targetDate.value || undefined
  };

  emit('save', formData);
};
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{{ isEditing ? 'Edit Badge' : 'Create New Badge' }}</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <!-- Basic Information -->
          <div class="space-y-2">
            <Label for="badge-name">Name</Label>
            <Input
              id="badge-name"
              v-model="name"
              placeholder="Badge name"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="badge-description">Description</Label>
            <Textarea
              id="badge-description"
              v-model="description"
              placeholder="Describe what this badge represents"
              required
              rows="3"
            />
          </div>

          <div class="space-y-2">
            <Label for="badge-status">Status</Label>
            <select
              id="badge-status"
              v-model="status"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option :value="BadgeStatus.NOT_STARTED">Not Started</option>
              <option :value="BadgeStatus.IN_PROGRESS">In Progress</option>
              <option :value="BadgeStatus.COMPLETED">Completed</option>
              <option :value="BadgeStatus.ARCHIVED">Archived</option>
            </select>
          </div>

          <!-- Timeline -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="start-date">Start Date</Label>
              <Input
                id="start-date"
                v-model="startDate"
                type="date"
              />
            </div>
            <div class="space-y-2">
              <Label for="target-date">Target Date</Label>
              <Input
                id="target-date"
                v-model="targetDate"
                type="date"
              />
            </div>
          </div>

          <!-- Requirements -->
          <div class="space-y-3">
            <Label>Requirements</Label>
            <div 
              v-for="(req, index) in requirements" 
              :key="req.id"
              class="flex items-center space-x-2"
            >
              <GripIcon class="h-4 w-4 text-muted-foreground" />
              <Input
                v-model="req.description"
                placeholder="Requirement description"
                class="flex-1"
                required
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon"
                @click="removeRequirement(index)"
                :disabled="requirements.length <= 1"
              >
                <XIcon class="h-4 w-4" />
              </Button>
            </div>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              @click="addRequirement"
              class="mt-2"
            >
              <PlusIcon class="h-4 w-4 mr-2" />
              Add Requirement
            </Button>
          </div>

          <!-- Additional Content -->
          <div class="space-y-2">
            <Label for="badge-content">Additional Content</Label>
            <Textarea
              id="badge-content"
              v-model="content"
              placeholder="Optional notes, instructions, or additional information"
              rows="5"
            />
          </div>
        </CardContent>
        <CardFooter class="flex justify-end space-x-2">
          <Button type="button" variant="outline" @click="$emit('cancel')">
            Cancel
          </Button>
          <Button type="submit" :disabled="!isValid">
            {{ isEditing ? 'Update Badge' : 'Create Badge' }}
          </Button>
        </CardFooter>
      </Card>
    </form>
  </div>
</template>