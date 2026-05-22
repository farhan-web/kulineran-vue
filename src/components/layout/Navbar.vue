<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ShoppingBag, Menu, X, ChefHat, CircleUser, LayoutDashboard } from '@lucide/vue'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const cartStore = useCartStore()
const authStore = useAuthStore()
const route = useRoute()
const isMenuOpen = ref(false)

onMounted(() => {
  if (authStore.isLoggedIn) {
    cartStore.fetchCart()
  }
})
</script>

<template>
  <!-- Navbar disembunyikan di halaman login -->
  <header
    v-if="route.name !== 'login'"
    class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <div class="container flex h-16 items-center">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2 font-bold text-xl text-primary">
        <ChefHat class="h-6 w-6" />
        <span>Kulineran</span>
      </RouterLink>

      <!-- Desktop Nav -->
      <nav class="ml-8 hidden md:flex items-center gap-6">
        <RouterLink
          to="/"
          class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          active-class="text-foreground font-semibold"
          exact-active-class="text-foreground font-semibold"
        >
          Home
        </RouterLink>
        <RouterLink
          to="/foods"
          class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          active-class="text-foreground font-semibold"
        >
          Menu
        </RouterLink>
        <!-- Link Admin — hanya muncul jika user adalah ADMIN -->
        <RouterLink
          v-if="authStore.user?.role === 'ADMIN'"
          to="/admin/products"
          class="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          active-class="text-foreground font-semibold"
        >
          Admin
        </RouterLink>
      </nav>

      <!-- Right side -->
      <div class="ml-auto flex items-center gap-3">
        <!-- Cart (hanya jika sudah login) -->
        <RouterLink v-if="authStore.isLoggedIn" to="/keranjang">
          <Button variant="outline" size="icon" class="relative">
            <ShoppingBag class="h-5 w-5" />
            <Badge
              v-if="cartStore.totalItems > 0"
              class="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {{ cartStore.totalItems }}
            </Badge>
          </Button>
        </RouterLink>

        <!-- Sudah login: icon profil -->
        <template v-if="authStore.isLoggedIn">
          <RouterLink to="/profil">
            <Button variant="ghost" size="icon" title="Profil">
              <CircleUser class="h-5 w-5" />
            </Button>
          </RouterLink>
        </template>

        <!-- Belum login: tombol Login -->
        <template v-else>
          <RouterLink to="/login">
            <Button size="sm">Login</Button>
          </RouterLink>
        </template>

        <!-- Mobile menu toggle -->
        <Button
          variant="ghost"
          size="icon"
          class="md:hidden"
          @click="isMenuOpen = !isMenuOpen"
        >
          <Menu v-if="!isMenuOpen" class="h-5 w-5" />
          <X v-else class="h-5 w-5" />
        </Button>
      </div>
    </div>

    <!-- Mobile Nav -->
    <div v-if="isMenuOpen" class="md:hidden border-t bg-background">
      <nav class="container flex flex-col py-3 gap-1">
        <RouterLink
          to="/"
          class="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent"
          active-class="bg-accent font-semibold"
          @click="isMenuOpen = false"
        >
          Home
        </RouterLink>
        <RouterLink
          to="/foods"
          class="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent"
          active-class="bg-accent font-semibold"
          @click="isMenuOpen = false"
        >
          Menu
        </RouterLink>
        <RouterLink
          v-if="authStore.user?.role === 'ADMIN'"
          to="/admin/products"
          class="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent flex items-center gap-2"
          active-class="bg-accent font-semibold"
          @click="isMenuOpen = false"
        >
          <LayoutDashboard class="h-4 w-4" />
          Admin
        </RouterLink>
        <RouterLink
          v-if="authStore.isLoggedIn"
          to="/keranjang"
          class="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent flex items-center gap-2"
          @click="isMenuOpen = false"
        >
          <ShoppingBag class="h-4 w-4" />
          Keranjang
          <Badge v-if="cartStore.totalItems > 0">{{ cartStore.totalItems }}</Badge>
        </RouterLink>
        <RouterLink
          v-if="authStore.isLoggedIn"
          to="/profil"
          class="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent flex items-center gap-2"
          @click="isMenuOpen = false"
        >
          <CircleUser class="h-4 w-4" />
          Profil ({{ authStore.user?.username }})
        </RouterLink>
        <RouterLink
          v-else
          to="/login"
          class="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent"
          @click="isMenuOpen = false"
        >
          Login
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
