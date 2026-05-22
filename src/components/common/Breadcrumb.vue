<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ChevronRight } from '@lucide/vue'

interface BreadcrumbItem {
  label: string
  to?: string
}

defineProps<{ items: BreadcrumbItem[] }>()
</script>

<template>
  <nav aria-label="breadcrumb">
    <ol class="flex items-center gap-1.5 text-sm text-muted-foreground">
      <li v-for="(item, index) in items" :key="index" class="flex items-center gap-1.5">
        <ChevronRight v-if="index > 0" class="h-4 w-4" />
        <RouterLink
          v-if="item.to"
          :to="item.to"
          class="hover:text-foreground transition-colors"
        >
          {{ item.label }}
        </RouterLink>
        <span v-else class="font-medium text-foreground">{{ item.label }}</span>
      </li>
    </ol>
  </nav>
</template>
