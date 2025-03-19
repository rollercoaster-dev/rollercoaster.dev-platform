<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Badge, BadgeStatus, CreateBadgeDto, UpdateBadgeDto, UpdateBadgeProgressDto } from '../types/badge';
import BadgeList from '../components/badge/BadgeList.vue';
import BadgeDetails from '../components/badge/BadgeDetails.vue';
import BadgeForm from '../components/badge/BadgeForm.vue';
import { Button } from '@/components/ui/button';
import { useToast } from '@/composables/useToast';
import { badgeService, BadgeServiceError } from '@/services/badgeService';

// Badge data and states
const badges = ref<Badge[]>([]);
const selectedBadgeId = ref<string | null>(null);
const isLoading = ref(true);
const isCreating = ref(false);
const isEditing = ref(false);

// State to track the active view
const activeView = ref<'list' | 'details' | 'form'>('list');

// Toast notifications for feedback
const { toast } = useToast();

// Load badges from the server
onMounted(async () => {
  try {
    // Fetch badges from the API
    badges.value = await badgeService.getBadges();
    isLoading.value = false;
  } catch (error) {
    console.error('Error loading badges:', error);
    
    // If the server is unavailable, show a dummy set of badges for demonstration
    if (error instanceof BadgeServiceError && error.statusCode === 503) {
      toast({
        title: 'Server Unavailable',
        description: 'Using demo data - badge server is unavailable',
        variant: 'warning',
      });
      
      // Load dummy data
      await loadDummyData();
    } else {
      toast({
        title: 'Error',
        description: 'Failed to load badges. Please try again.',
        variant: 'destructive',
      });
      
      // Load dummy data for demonstration purposes
      await loadDummyData();
    }
  }
});

// Load dummy data for demonstration when server is unavailable
const loadDummyData = async () => {
  // Simulate loading delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  badges.value = [
    {
      id: '1',
      name: 'JavaScript Fundamentals',
      description: 'Master the basics of JavaScript programming language',
      content: 'Focus on core JavaScript concepts including variables, functions, objects, and asynchronous programming.',
      progress: 75,
      status: BadgeStatus.IN_PROGRESS,
      requirements: [
        { id: '101', description: 'Learn variables and data types', completed: true },
        { id: '102', description: 'Understand functions and scope', completed: true },
        { id: '103', description: 'Master objects and prototypes', completed: true },
        { id: '104', description: 'Practice asynchronous JS with Promises', completed: false },
      ],
      createdAt: new Date(2023, 0, 15).toISOString(),
      updatedAt: new Date(2023, 2, 10).toISOString(),
      startDate: new Date(2023, 0, 15).toISOString(),
      targetDate: new Date(2023, 5, 30).toISOString(),
    },
    {
      id: '2',
      name: 'Vue.js Expert',
      description: 'Become proficient in Vue.js framework and ecosystem',
      progress: 30,
      status: BadgeStatus.IN_PROGRESS,
      requirements: [
        { id: '201', description: 'Learn Vue.js core concepts', completed: true },
        { id: '202', description: 'Master Vue Router', completed: true },
        { id: '203', description: 'Understand Vuex for state management', completed: false },
        { id: '204', description: 'Build a complete application with Vue.js', completed: false },
        { id: '205', description: 'Learn Nuxt.js framework', completed: false },
      ],
      createdAt: new Date(2023, 1, 5).toISOString(),
      updatedAt: new Date(2023, 2, 18).toISOString(),
      startDate: new Date(2023, 1, 5).toISOString(),
    },
    {
      id: '3',
      name: 'CSS Mastery',
      description: 'Master advanced CSS techniques and modern frameworks',
      progress: 100,
      status: BadgeStatus.COMPLETED,
      requirements: [
        { id: '301', description: 'Learn CSS fundamentals', completed: true },
        { id: '302', description: 'Master CSS layouts with Flexbox', completed: true },
        { id: '303', description: 'Master CSS Grid', completed: true },
        { id: '304', description: 'Learn CSS animations and transitions', completed: true },
        { id: '305', description: 'Understand CSS preprocessors like SASS', completed: true },
      ],
      createdAt: new Date(2022, 9, 10).toISOString(),
      updatedAt: new Date(2023, 0, 25).toISOString(),
      startDate: new Date(2022, 9, 10).toISOString(),
      targetDate: new Date(2022, 11, 31).toISOString(),
    },
  ];
  
  isLoading.value = false;
};

// Actions
const viewBadge = async (id: string) => {
  try {
    // In a real application, you would fetch the badge details
    if (!badges.value.find(b => b.id === id)) {
      const badge = await badgeService.getBadgeById(id);
      badges.value.push(badge);
    }
    
    selectedBadgeId.value = id;
    activeView.value = 'details';
  } catch (error) {
    console.error('Error fetching badge details:', error);
    toast({
      title: 'Error',
      description: 'Failed to load badge details',
      variant: 'destructive',
    });
  }
};

const createBadge = () => {
  selectedBadgeId.value = null;
  isCreating.value = true;
  isEditing.value = false;
  activeView.value = 'form';
};

const editBadge = (id: string) => {
  selectedBadgeId.value = id;
  isCreating.value = false;
  isEditing.value = true;
  activeView.value = 'form';
};

const cancelForm = () => {
  if (isEditing.value && selectedBadgeId.value) {
    activeView.value = 'details';
  } else {
    activeView.value = 'list';
  }
  isCreating.value = false;
  isEditing.value = false;
};

const saveForm = async (badgeData: CreateBadgeDto | UpdateBadgeDto) => {
  try {
    if (isCreating.value) {
      // Create new badge
      const newBadge = await badgeService.createBadge(badgeData as CreateBadgeDto);
      badges.value.push(newBadge);
      
      toast({
        title: 'Success',
        description: 'Badge created successfully',
      });
      
      // View the newly created badge
      selectedBadgeId.value = newBadge.id;
      activeView.value = 'details';
    } else if (isEditing.value && selectedBadgeId.value) {
      // Update existing badge
      const updatedBadge = await badgeService.updateBadge(selectedBadgeId.value, badgeData);
      
      // Update local badge data
      const index = badges.value.findIndex(b => b.id === selectedBadgeId.value);
      if (index !== -1) {
        badges.value[index] = updatedBadge;
      }
      
      toast({
        title: 'Success',
        description: 'Badge updated successfully',
      });
      
      // View the updated badge
      activeView.value = 'details';
    }
  } catch (error) {
    console.error('Error saving badge:', error);
    toast({
      title: 'Error',
      description: error instanceof BadgeServiceError 
        ? error.message 
        : 'Failed to save badge. Please try again.',
      variant: 'destructive',
    });
  } finally {
    isCreating.value = false;
    isEditing.value = false;
  }
};

const deleteBadge = async (id: string) => {
  if (confirm('Are you sure you want to delete this badge?')) {
    try {
      await badgeService.deleteBadge(id);
      
      // Remove from local state
      badges.value = badges.value.filter(b => b.id !== id);
      
      toast({
        title: 'Success',
        description: 'Badge deleted successfully',
      });
      
      if (selectedBadgeId.value === id) {
        selectedBadgeId.value = null;
        activeView.value = 'list';
      }
    } catch (error) {
      console.error('Error deleting badge:', error);
      toast({
        title: 'Error',
        description: error instanceof BadgeServiceError 
          ? error.message 
          : 'Failed to delete badge. Please try again.',
        variant: 'destructive',
      });
    }
  }
};

const toggleRequirement = async (requirementId: string, completed: boolean) => {
  if (selectedBadgeId.value) {
    try {
      const badgeIndex = badges.value.findIndex(b => b.id === selectedBadgeId.value);
      if (badgeIndex !== -1) {
        const badge = badges.value[badgeIndex];
        const reqIndex = badge.requirements.findIndex(r => r.id === requirementId);
        
        if (reqIndex !== -1) {
          // Update locally first for immediate feedback
          badge.requirements[reqIndex].completed = completed;
          const progress = calculateProgress(badge.requirements);
          badge.progress = progress;
          
          // Update on server
          const progressData: UpdateBadgeProgressDto = {
            requirements: [
              { id: requirementId, completed }
            ]
          };
          
          const updatedBadge = await badgeService.updateBadgeProgress(selectedBadgeId.value, progressData);
          
          // Update with server response
          badges.value[badgeIndex] = updatedBadge;
        }
      }
    } catch (error) {
      console.error('Error updating requirement:', error);
      toast({
        title: 'Error',
        description: 'Failed to update requirement. Please try again.',
        variant: 'destructive',
      });
    }
  }
};

// Helper functions
const getSelectedBadge = () => {
  if (!selectedBadgeId.value) return null;
  return badges.value.find(b => b.id === selectedBadgeId.value) || null;
};

const calculateProgress = (requirements: { completed: boolean }[]) => {
  if (!requirements || requirements.length === 0) return 0;
  const completedCount = requirements.filter(r => r.completed).length;
  return Math.round((completedCount / requirements.length) * 100);
};

const backToList = () => {
  activeView.value = 'list';
  selectedBadgeId.value = null;
};
</script>

<template>
  <div class="container mx-auto py-8 px-4">
    <!-- Back button when viewing details or form -->
    <div v-if="activeView !== 'list'" class="mb-6">
      <Button variant="outline" size="sm" @click="backToList">
        &larr; Back to Badges
      </Button>
    </div>
    
    <!-- Badge List View -->
    <BadgeList
      v-if="activeView === 'list'"
      :badges="badges"
      :loading="isLoading"
      @view="viewBadge"
      @edit="editBadge"
      @delete="deleteBadge"
      @create="createBadge"
    />
    
    <!-- Badge Details View -->
    <BadgeDetails
      v-else-if="activeView === 'details' && getSelectedBadge()"
      :badge="getSelectedBadge()!"
      @edit="editBadge(selectedBadgeId!)"
      @delete="deleteBadge(selectedBadgeId!)"
      @toggleRequirement="toggleRequirement"
    />
    
    <!-- Badge Form (Create/Edit) -->
    <BadgeForm
      v-else-if="activeView === 'form'"
      :badge="isEditing ? getSelectedBadge()! : undefined"
      :isEditing="isEditing"
      @save="saveForm"
      @cancel="cancelForm"
    />
  </div>
</template>