# 08 — Layout & Shared Components

---

## App.vue — Root Component

```vue
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
      <RouterView />     <!-- halaman aktif di-render di sini -->
    </div>
    <Footer />
    <Toaster position="top-right" rich-colors />   <!-- toast notifications -->
  </div>
</template>
```

`min-h-screen flex flex-col` + `flex-1` pada konten = layout yang memastikan Footer selalu di bawah meski konten sedikit (sticky footer pattern).

---

## Navbar.vue

**File:** `src/components/layout/Navbar.vue`

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ShoppingBag, Menu, X, ChefHat } from '@lucide/vue'
import { useCartStore } from '@/stores/cartStore'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const cartStore = useCartStore()
const isMenuOpen = ref(false)   // state untuk toggle mobile menu

// Saat Navbar mount, ambil data keranjang untuk tampilkan badge count
onMounted(() => {
  cartStore.fetchCart()
})
</script>
```

**Template Navbar:**
```vue
<template>
  <header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur ...">
    <div class="container flex h-16 items-center">

      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2 font-bold text-xl text-primary">
        <ChefHat class="h-6 w-6" />
        <span>Kulineran</span>
      </RouterLink>

      <!-- Desktop Nav (tersembunyi di mobile) -->
      <nav class="ml-8 hidden md:flex items-center gap-6">
        <RouterLink to="/" active-class="font-semibold" exact-active-class="font-semibold">
          Home
        </RouterLink>
        <RouterLink to="/foods" active-class="font-semibold">
          Menu
        </RouterLink>
      </nav>

      <!-- Tombol Cart + Mobile Toggle -->
      <div class="ml-auto flex items-center gap-3">
        <RouterLink to="/keranjang">
          <Button variant="outline" size="icon" class="relative">
            <ShoppingBag class="h-5 w-5" />
            <!-- Badge count hanya muncul kalau ada item -->
            <Badge v-if="cartStore.totalItems > 0" class="absolute -top-2 -right-2 ...">
              {{ cartStore.totalItems }}
            </Badge>
          </Button>
        </RouterLink>

        <!-- Hamburger menu (hanya mobile) -->
        <Button variant="ghost" size="icon" class="md:hidden" @click="isMenuOpen = !isMenuOpen">
          <Menu v-if="!isMenuOpen" />
          <X v-else />
        </Button>
      </div>
    </div>

    <!-- Mobile Dropdown -->
    <div v-if="isMenuOpen" class="md:hidden border-t bg-background">
      <nav class="container flex flex-col py-3 gap-1">
        <RouterLink to="/" @click="isMenuOpen = false">Home</RouterLink>
        <RouterLink to="/foods" @click="isMenuOpen = false">Menu</RouterLink>
        <RouterLink to="/keranjang" @click="isMenuOpen = false">
          <ShoppingBag /> Keranjang
          <Badge v-if="cartStore.totalItems > 0">{{ cartStore.totalItems }}</Badge>
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
```

**Konsep penting:**
- `sticky top-0 z-50` — navbar menempel di atas saat scroll
- `bg-background/95 backdrop-blur` — sedikit transparan dengan blur efek frosted glass
- `hidden md:flex` — sembunyikan di mobile, tampilkan di desktop (md = 768px+)
- `active-class` dan `exact-active-class` di RouterLink — class yang ditambah otomatis saat route aktif
- `v-if="isMenuOpen"` — toggle dropdown mobile

---

## Footer.vue

**File:** `src/components/layout/Footer.vue`

```vue
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
```

`new Date().getFullYear()` — tahun copyright otomatis update tiap tahun.

---

## FoodCard.vue

**File:** `src/components/food/FoodCard.vue`

Komponen kartu produk yang dipakai di HomeView dan FoodsView.

```vue
<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ShoppingCart } from '@lucide/vue'
import type { Product } from '@/types'
import { useCartStore } from '@/stores/cartStore'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

defineProps<{ product: Product }>()   // hanya butuh satu prop: product

const cartStore = useCartStore()      // untuk format harga
</script>

<template>
  <!-- group = nama group hover untuk trigger efek di child -->
  <Card class="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
    <div class="aspect-[4/3] overflow-hidden">
      <img
        :src="`/assets/images/${product.gambar}`"
        :alt="product.nama"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"    <!-- lazy load gambar -->
      />
    </div>
    <CardContent class="p-4">
      <h3 class="font-semibold text-base line-clamp-1">{{ product.nama }}</h3>
      <p class="text-primary font-bold mt-1">
        Rp {{ cartStore.formatPrice(product.harga) }}
      </p>
    </CardContent>
    <CardFooter class="p-4 pt-0">
      <RouterLink :to="`/foods/${product.id}`" class="w-full">
        <Button class="w-full gap-2">
          <ShoppingCart class="h-4 w-4" />
          Pesan
        </Button>
      </RouterLink>
    </CardFooter>
  </Card>
</template>
```

**Konsep penting:**
- `group` + `group-hover:scale-105` — zoom gambar saat hover card (Tailwind group hover)
- `aspect-[4/3]` — rasio gambar selalu konsisten
- `object-cover` — gambar fill container tanpa distorsi
- `line-clamp-1` — teks nama dipotong satu baris kalau terlalu panjang
- `loading="lazy"` — gambar hanya dimuat saat masuk viewport (performa)

---

## FoodCardSkeleton.vue

**File:** `src/components/food/FoodCardSkeleton.vue`

Loading placeholder saat data belum ada:

```vue
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
```

`animate-pulse` adalah class Tailwind untuk efek skeleton loading (fade in-out berulang).

**Cara pakai di views:**
```vue
<template v-if="foodStore.isLoading">
  <FoodCardSkeleton v-for="n in 3" :key="n" />   <!-- tampilkan 3 skeleton -->
</template>
<template v-else>
  <FoodCard v-for="product in products" :key="product.id" :product="product" />
</template>
```

---

## Breadcrumb.vue

**File:** `src/components/common/Breadcrumb.vue`

```vue
<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ChevronRight } from '@lucide/vue'

interface BreadcrumbItem {
  label: string
  to?: string     // kalau ada 'to', render sebagai link; kalau tidak, render sebagai teks biasa
}

defineProps<{ items: BreadcrumbItem[] }>()
</script>

<template>
  <nav aria-label="breadcrumb">
    <ol class="flex items-center gap-1.5 text-sm text-muted-foreground">
      <li v-for="(item, index) in items" :key="index" class="flex items-center gap-1.5">
        <!-- Separator hanya muncul mulai item kedua -->
        <ChevronRight v-if="index > 0" class="h-4 w-4" />
        <!-- Link jika ada 'to', teks biasa jika tidak -->
        <RouterLink v-if="item.to" :to="item.to" class="hover:text-foreground transition-colors">
          {{ item.label }}
        </RouterLink>
        <span v-else class="font-medium text-foreground">{{ item.label }}</span>
      </li>
    </ol>
  </nav>
</template>
```

**Cara pakai:**
```ts
// Definisi breadcrumb di halaman
const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Menu', to: '/foods' },
  { label: 'Detail Makanan' },   // tanpa 'to' → plain text (item aktif)
]
```
```vue
<Breadcrumb :items="breadcrumbs" class="mb-6" />
```
