<script setup lang="ts">
interface Props {
  href: string;
  text: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'accent' | 'text';
  icon?: 'arrow-right' | 'arrow-up' | 'arrow-down' | 'none';
  target?: string;
  rel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'text',
  icon: 'arrow-right',
  target: '_blank',
  rel: 'noopener noreferrer'
});

// Compute classes based on variant
const classes = computed(() => {
  const baseClasses = 'inline-flex items-center gap-2 px-6 py-2 rounded-md font-medium transition-colors';
  
  switch (props.variant) {
    case 'primary':
      return `${baseClasses} bg-primary text-primary-foreground hover:bg-primary/90`;
    case 'secondary':
      return `${baseClasses} bg-secondary text-secondary-foreground hover:bg-secondary/90`;
    case 'outline':
      return `${baseClasses} border border-primary text-primary hover:bg-primary/10`;
    case 'accent':
      return `${baseClasses} bg-accent text-accent-foreground hover:bg-accent/90`;
    case 'text':
    default:
      return `${baseClasses} text-accent hover:underline`;
  }
});

// Compute icon element based on icon type
const iconElement = computed(() => {
  if (props.icon === 'none') return '';
  
  const icons = {
    'arrow-right': '→',
    'arrow-up': '↑',
    'arrow-down': '↓'
  };
  
  return `<span class="text-lg">${icons[props.icon]}</span>`;
});
</script>

<template>
  <a
    :href="href"
    :class="classes"
    :target="target"
    :rel="rel"
  >
    {{ text }}
    <span v-if="icon !== 'none'" class="text-lg">
      {{ icon === 'arrow-right' ? '→' : icon === 'arrow-up' ? '↑' : '↓' }}
    </span>
  </a>
</template>
