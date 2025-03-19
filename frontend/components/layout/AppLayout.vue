<script setup lang="ts">
import { Toaster } from '@/components/ui/toaster';
import { 
  LayoutDashboard, 
  Award, 
  FileText, 
  Settings, 
  LogOut,
  Cpu,
  Search,
  User 
} from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NavItem {
  name: string;
  icon: any;
  path: string;
  active?: boolean;
}

const mainNavItems: NavItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', active: true },
  { name: 'Badges', icon: Award, path: '/badges' },
  { name: 'Reports', icon: FileText, path: '/reports' },
  { name: 'Integration', icon: Cpu, path: '/integration' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];
</script>

<template>
  <div class="min-h-screen flex flex-col bg-background">
    <!-- Header -->
    <header class="border-b sticky top-0 z-40 bg-background">
      <div class="flex h-16 items-center px-4 md:px-6">
        <div class="flex items-center gap-2 font-semibold">
          <Award class="h-6 w-6 text-primary" />
          <span class="hidden md:inline-block">Badge Achievement System</span>
        </div>
        <div class="ml-auto flex items-center space-x-4">
          <div class="relative hidden md:block">
            <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search everything..."
              class="w-64 pl-8"
            />
          </div>
          <Button variant="ghost" size="icon" class="rounded-full">
            <User class="h-5 w-5" />
            <span class="sr-only">User menu</span>
          </Button>
        </div>
      </div>
    </header>
    
    <!-- Main layout with sidebar -->
    <div class="flex-1 flex">
      <!-- Sidebar navigation -->
      <aside class="hidden md:flex w-64 flex-col border-r p-4 pt-8">
        <nav class="space-y-1 flex-1">
          <div v-for="item in mainNavItems" :key="item.name" class="mb-2">
            <Button
              variant="ghost"
              :class="[
                'w-full justify-start text-muted-foreground hover:bg-muted hover:text-foreground',
                item.active ? 'bg-muted text-foreground font-medium' : ''
              ]"
              :to="item.path"
            >
              <component :is="item.icon" class="h-5 w-5 mr-3" />
              {{ item.name }}
            </Button>
          </div>
        </nav>
        
        <div class="border-t pt-4 mt-4">
          <Button variant="ghost" class="w-full justify-start text-muted-foreground">
            <LogOut class="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>
      
      <!-- Main content -->
      <main class="flex-1">
        <slot />
      </main>
    </div>
    
    <!-- Toast notifications -->
    <Toaster />
  </div>
</template>