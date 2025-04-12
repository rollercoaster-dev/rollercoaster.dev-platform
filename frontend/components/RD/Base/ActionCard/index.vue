<script setup lang="ts">
import {
  UICard,
  UICardHeader,
  UICardTitle,
  UICardContent,
  UICardFooter,
} from '#components';
import RDBaseFeatureItem from '~/components/rd/Base/FeatureItem/index.vue';

export type ActionCardProps = {
  title: string;
  icon?: string;
  description: string;
  features: string[];
  actions: {
    text: string;
    href: string;
    variant?: 'primary' | 'secondary' | 'outline';
    internal?: boolean;
  }[];
};

const props = withDefaults(defineProps<ActionCardProps>(), {
  icon: '',
  actions: () => []
});
</script>

<template>
  <UICard class="grid grid-rows-[auto_1fr_auto]">
    <UICardHeader>
      <UICardTitle class="text-xl flex items-center gap-2">
        <span v-if="icon" class="text-2xl text-accent">{{ icon }}</span>
        {{ title }}
      </UICardTitle>
    </UICardHeader>
    <UICardContent>
      <p class="text-muted-foreground">
        {{ description }}
      </p>
      <ul class="mt-4 space-y-2">
        <RDBaseFeatureItem 
          v-for="(feature, index) in features" 
          :key="index" 
          :text="feature"
        />
      </ul>
      <slot name="content"></slot>
    </UICardContent>
    <UICardFooter>
      <slot name="footer">
        <div :class="{ 'w-full': actions.length > 0, 'grid grid-cols-2 gap-4': actions.length > 1, 'flex justify-center': actions.length === 1 }">
          <template v-for="(action, index) in actions" :key="index">
            <RDBaseLink
              :href="action.href"
              :variant="action.variant || 'primary'"
              :internal="action.internal"
              class="justify-center focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
              :class="{ 'w-full': actions.length === 1 }"
            >
              {{ action.text }}
            </RDBaseLink>
          </template>
        </div>
      </slot>
    </UICardFooter>
  </UICard>
</template>
