<script setup lang="ts">
import { Sun, Moon, Focus, EyeOff } from 'lucide-vue-next'
import { Tooltip } from '@/components/ui/tooltip'

const colorMode = useColorMode()

// Computed properties for mode states
const isDark = computed(() => colorMode.value === 'dark' || colorMode.value === 'focus-dark')
const isFocus = computed(() => colorMode.value === 'focus' || colorMode.value === 'focus-dark')

// Toggle between focus and non-focus modes while preserving dark/light preference
const toggleFocusMode = () => {
  if (isFocus.value) {
    colorMode.preference = isDark.value ? 'dark' : 'light'
  } else {
    colorMode.preference = isDark.value ? 'focus-dark' : 'focus'
  }
}

// Toggle between dark and light modes while preserving focus state
const toggleDarkMode = () => {
  if (isDark.value) {
    colorMode.preference = isFocus.value ? 'focus' : 'light'
  } else {
    colorMode.preference = isFocus.value ? 'focus-dark' : 'dark'
  }
}

// Setup keyboard shortcuts
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    // Check if Cmd/Ctrl is pressed
    if (e.metaKey || e.ctrlKey) {
      switch (e.key.toLowerCase()) {
        case 'd':
          e.preventDefault()
          toggleDarkMode()
          break
        case 'f':
          e.preventDefault()
          toggleFocusMode()
          break
      }
    }
  }

  window.addEventListener('keydown', handleKeydown)
  onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
})

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' }
]
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="container flex h-16 items-center">
      <!-- Logo -->
      <NuxtLink to="/" class="mr-8">
        <h1 class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          rollercoaster.dev
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
        <Tooltip :content="isDark ? 'Switch to light mode\nShortcut: Cmd + D' : 'Switch to dark mode\nShortcut: Cmd + D'">
          <Button
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
          </Button>
        </Tooltip>

        <Tooltip :content="isFocus ? 'Exit focus mode\nShortcut: Cmd + F' : 'Enter focus mode\nShortcut: Cmd + F'">
          <Button
            @click="toggleFocusMode"
            :variant="isFocus ? 'default' : 'ghost'"
            size="icon"
            class="rounded-full"
          >
            <Focus v-if="!isFocus" class="h-5 w-5" />
            <EyeOff v-else class="h-5 w-5" />
            <span class="sr-only">
              {{ isFocus ? 'Exit focus mode' : 'Enter focus mode' }}
            </span>
          </Button>
        </Tooltip>
      </div>
    </div>
  </header>
</template> 