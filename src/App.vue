<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Toaster } from 'vue-sonner'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />
    <div class="flex-1">
      <RouterView />
    </div>
    <Footer />
    <Toaster position="top-right" rich-colors />
  </div>
</template>
