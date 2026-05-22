<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowRight } from '@lucide/vue'
import { useFoodStore } from '@/stores/foodStore'
import FoodCard from '@/components/food/FoodCard.vue'
import FoodCardSkeleton from '@/components/food/FoodCardSkeleton.vue'
import { Button } from '@/components/ui/button'

const foodStore = useFoodStore()

onMounted(() => {
  foodStore.fetchBestProducts()
})
</script>

<template>
  <main>
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-primary/5 via-background to-background py-16 md:py-24">
      <div class="container">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div class="space-y-6">
            <h1 class="text-4xl md:text-5xl font-bold leading-tight">
              Delicious Food Menu,
              <span class="text-primary">in Your Gadget</span>
            </h1>
            <p class="text-lg text-muted-foreground">
              Ayo segera pilih dan pesan makanan favorit Anda. Nikmati berbagai pilihan menu lezat langsung dari meja Anda.
            </p>
            <RouterLink to="/foods">
              <Button size="lg" class="gap-2">
                <ArrowRight class="h-5 w-5" />
                Lihat Menu
              </Button>
            </RouterLink>
          </div>
          <div class="flex justify-center">
            <img
              src="/assets/images/hero.png"
              alt="Delicious food illustration"
              class="max-w-full h-auto rounded-2xl"
              width="480"
              height="400"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Best Products Section -->
    <section class="container py-16">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl font-bold">Best <span class="text-primary">Foods</span></h2>
          <p class="text-muted-foreground mt-1">Menu pilihan terbaik kami</p>
        </div>
        <RouterLink to="/foods">
          <Button variant="outline" class="gap-2">
            <ArrowRight class="h-4 w-4" />
            Lihat Semua
          </Button>
        </RouterLink>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <template v-if="foodStore.isLoading">
          <FoodCardSkeleton v-for="n in 3" :key="n" />
        </template>
        <template v-else>
          <FoodCard
            v-for="product in foodStore.bestProducts"
            :key="product.id"
            :product="product"
          />
        </template>
      </div>

      <div v-if="!foodStore.isLoading && foodStore.bestProducts.length === 0" class="text-center py-12 text-muted-foreground">
        Belum ada produk tersedia.
      </div>
    </section>
  </main>
</template>
