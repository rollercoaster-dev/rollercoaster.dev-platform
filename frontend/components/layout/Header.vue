<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next';

const colorMode = useColorMode();

// Computed properties for mode states
const isDark = computed(() => colorMode.value === 'dark');

// Toggle between dark and light modes
const toggleDarkMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
};

// Setup keyboard shortcuts
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    // Check if Cmd/Ctrl is pressed
    if (e.metaKey || e.ctrlKey) {
      switch (e.key.toLowerCase()) {
        case 'd':
          e.preventDefault();
          toggleDarkMode();
          break;
      }
    }
  };

  window.addEventListener('keydown', handleKeydown);
  onUnmounted(() => window.removeEventListener('keydown', handleKeydown));
});

const navigation = [
  { name: '', href: '' },
  // { name: 'Home', href: '/' },
  // { name: 'About', href: '/about' },
  // { name: 'Blog', href: '/blog' },
  // { name: 'Contact', href: '/contact' }
];
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <div class="container flex h-16 items-center">
      <!-- Logo -->
      <NuxtLink to="/" class="mr-8">
        <h1 class="text-2xl font-bold">
          <RDHeadlineGradient>rollercoaster.dev</RDHeadlineGradient>
        </h1>
      </NuxtLink>

      <!-- Navigation -->
      <nav class="flex items-center space-x-6 text-sm font-medium flex-1">
        <NuxtLink
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          class="transition-colors hover:text-primary"
        >
          {{ item.name }}
        </NuxtLink>
      </nav>

      <!-- Mode Toggles -->
      <div class="flex items-center space-x-2">
        <ClientOnly>
          <UITooltip
            :content="
              isDark
                ? 'Switch to light mode\nShortcut: Cmd + D'
                : 'Switch to dark mode\nShortcut: Cmd + D'
            "
            side="bottom"
          >
            <UIButton
              @click="toggleDarkMode"
              variant="ghost"
              size="icon"
              class="rounded-full"
            >
              <Sun v-if="isDark" class="h-5 w-5" />
              <Moon v-else class="h-5 w-5" />
              <span class="sr-only">
                {{ isDark ? 'Switch to light mode' : 'Switch to dark mode' }}
              </span>
            </UIButton>
          </UITooltip>
        </ClientOnly>
      </div>
    </div>
  </header>
</template>
