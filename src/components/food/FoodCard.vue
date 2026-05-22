<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ShoppingCart } from '@lucide/vue'
import type { Product } from '@/types'
import { useCartStore } from '@/stores/cartStore'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

defineProps<{ product: Product }>()

const cartStore = useCartStore()
</script>

<template>
  <Card class="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
    <div class="aspect-[4/3] overflow-hidden relative">
      <img
        :src="product.gambar"
        :alt="product.nama"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        :class="product.stok === 0 ? 'opacity-50' : ''"
        loading="lazy"
      />
      <!-- Badge stok habis -->
      <div v-if="product.stok === 0" class="absolute inset-0 flex items-center justify-center">
        <Badge variant="destructive" class="text-sm px-3 py-1">Stok Habis</Badge>
      </div>
    </div>
    <CardContent class="p-4">
      <h3 class="font-semibold text-base line-clamp-1">{{ product.nama }}</h3>
      <div class="flex items-center justify-between mt-1">
        <p class="text-primary font-bold">
          Rp {{ cartStore.formatPrice(product.harga) }}
        </p>
        <span v-if="product.stok > 0" class="text-xs text-muted-foreground">
          Sisa {{ product.stok }}
        </span>
      </div>
    </CardContent>
    <CardFooter class="p-4 pt-0">
      <RouterLink :to="`/foods/${product.id}`" class="w-full">
        <Button class="w-full gap-2" :disabled="product.stok === 0">
          <ShoppingCart class="h-4 w-4" />
          {{ product.stok === 0 ? 'Stok Habis' : 'Pesan' }}
        </Button>
      </RouterLink>
    </CardFooter>
  </Card>
</template>
