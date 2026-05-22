<script setup lang="ts">
import { ChefHat } from '@lucide/vue'
</script>

<template>
  <footer class="border-t mt-16">
    <div class="container flex flex-col items-center gap-2 py-8 md:flex-row md:justify-between">
      <div class="flex items-center gap-2 text-primary font-semibold">
        <ChefHat class="h-5 w-5" />
        <span>Kulineran</span>
      </div>
      <p class="text-sm text-muted-foreground">
        &copy; {{ new Date().getFullYear() }} Kulineran. Semua hak dilindungi.
      </p>
    </div>
  </footer>
</template>
