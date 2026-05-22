<script setup lang="ts">
import { Card, CardContent, CardFooter } from '@/components/ui/card'
</script>

<template>
  <Card class="overflow-hidden">
    <div class="aspect-[4/3] bg-muted animate-pulse" />
    <CardContent class="p-4">
      <div class="h-4 w-3/4 bg-muted animate-pulse rounded" />
      <div class="h-4 w-1/3 bg-muted animate-pulse rounded mt-2" />
    </CardContent>
    <CardFooter class="p-4 pt-0">
      <div class="h-10 w-full bg-muted animate-pulse rounded-md" />
    </CardFooter>
  </Card>
</template>
