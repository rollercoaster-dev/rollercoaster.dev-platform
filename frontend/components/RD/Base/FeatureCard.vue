<script setup lang="ts">
import {
  UICard,
  UICardHeader,
  UICardTitle,
  UICardContent,
} from '#components';
import RDBaseFeatureItem from '~/components/rd/Base/FeatureItem/index.vue';

export type FeatureCardProps = {
  title: string;
  icon: string;
  description: string;
  features: string[];
};

const props = defineProps<FeatureCardProps>();
</script>

<template>
  <UICard class="overflow-hidden hover:shadow-lg transition-shadow group h-full flex flex-col">
    <UICardHeader>
      <UICardTitle class="flex items-center gap-2 text-xl">
        <span class="text-2xl text-accent">{{ icon }}</span>
        {{ title }}
      </UICardTitle>
    </UICardHeader>
    <UICardContent class="flex-1 flex flex-col">
      <p class="text-card-foreground/90">
        {{ description }}
      </p>
      <div v-if="features.length > 0" class="mt-auto pt-4 border-t border-border/50">
        <span class="text-xs text-muted-foreground">Key Features:</span>
        <ul class="mt-2 space-y-1 text-sm">
          <RDBaseFeatureItem
            v-for="(feature, index) in features"
            :key="index"
            :text="feature"
          />
        </ul>
      </div>
      <slot></slot>
    </UICardContent>
  </UICard>
</template>
