<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { Search } from '@lucide/vue'
import { useFoodStore } from '@/stores/foodStore'
import FoodCard from '@/components/food/FoodCard.vue'
import FoodCardSkeleton from '@/components/food/FoodCardSkeleton.vue'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@vueuse/core'

const foodStore = useFoodStore()
const searchInput = ref('')
const debouncedSearch = useDebounce(searchInput, 400)

watch(debouncedSearch, (query) => {
  foodStore.fetchProducts(query || undefined)
})

onMounted(() => {
  foodStore.fetchProducts()
})
</script>

<template>
  <main class="container py-10">
    <div class="mb-8">
      <h1 class="text-2xl font-bold">
        Daftar <span class="text-primary">Makanan</span>
      </h1>
      <p class="text-muted-foreground mt-1">Temukan menu favoritmu</p>
    </div>

    <!-- Search -->
    <div class="relative mb-8 max-w-md">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        v-model="searchInput"
        type="text"
        placeholder="Cari makanan kesukaan Anda..."
        class="pl-9"
      />
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <template v-if="foodStore.isLoading">
        <FoodCardSkeleton v-for="n in 8" :key="n" />
      </template>
      <template v-else>
        <FoodCard
          v-for="product in foodStore.products"
          :key="product.id"
          :product="product"
        />
      </template>
    </div>

    <!-- Empty State -->
    <div
      v-if="!foodStore.isLoading && foodStore.products.length === 0"
      class="text-center py-20"
    >
      <img
        src="/assets/images/menunggu.png"
        alt="Tidak ditemukan"
        class="mx-auto mb-4 h-40 w-auto opacity-50"
      />
      <h3 class="font-semibold text-lg">Makanan tidak ditemukan</h3>
      <p class="text-muted-foreground mt-1">
        Coba kata kunci yang berbeda
      </p>
    </div>
  </main>
</template>
