<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { CircleUser, ShoppingBag, LogOut, Calendar, Hash } from '@lucide/vue'
import { useAuthStore } from '@/stores/authStore'
import { orderApi } from '@/api/endpoints'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { OrderResponse, OrderItemResponse } from '@/types'

const authStore = useAuthStore()

const orders = ref<OrderResponse[]>([])
const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = true
  try {
    orders.value = await orderApi.getAll()
  } finally {
    isLoading.value = false
  }
})

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID').format(price)
}

function totalPesanan(order: OrderResponse) {
  return order.keranjangs.reduce(
    (sum, item: OrderItemResponse) => sum + item.products.harga * item.jumlah_pemesanan,
    0,
  )
}
</script>

<template>
  <div class="container max-w-2xl py-8 space-y-6">

    <!-- Info Profil -->
    <Card>
      <CardContent class="pt-6">
        <div class="flex items-center gap-4">
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CircleUser class="h-9 w-9" />
          </div>
          <div class="flex-1">
            <p class="text-xl font-bold">{{ authStore.user?.username }}</p>
            <Badge variant="secondary" class="mt-1 capitalize">
              {{ authStore.user?.role?.toLowerCase() }}
            </Badge>
          </div>
          <Button variant="outline" size="sm" class="gap-2" @click="authStore.logout()">
            <LogOut class="h-4 w-4" />
            Logout
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Riwayat Pesanan -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2 text-base">
          <ShoppingBag class="h-5 w-5" />
          Riwayat Pesanan
        </CardTitle>
      </CardHeader>
      <CardContent>

        <!-- Loading -->
        <div v-if="isLoading" class="space-y-3">
          <div v-for="i in 2" :key="i" class="h-24 rounded-lg bg-muted animate-pulse" />
        </div>

        <!-- Kosong -->
        <div v-else-if="orders.length === 0" class="py-8 text-center text-muted-foreground">
          <ShoppingBag class="mx-auto h-10 w-10 mb-2 opacity-30" />
          <p class="text-sm">Belum ada pesanan</p>
        </div>

        <!-- List pesanan -->
        <div v-else class="space-y-4">
          <div
            v-for="order in orders"
            :key="order.id"
            class="rounded-lg border p-4 space-y-3"
          >
            <!-- Header pesanan -->
            <div class="flex items-start justify-between gap-2">
              <div class="space-y-1">
                <div class="flex items-center gap-2 text-sm text-muted-foreground">
                  <Hash class="h-3.5 w-3.5" />
                  <span>Pesanan #{{ order.id }}</span>
                  <span>·</span>
                  <span>Meja {{ order.noMeja }}</span>
                </div>
                <p class="font-medium">{{ order.nama }}</p>
              </div>
              <div class="text-right shrink-0">
                <p class="font-semibold text-primary">
                  Rp {{ formatPrice(totalPesanan(order)) }}
                </p>
                <p class="text-xs text-muted-foreground flex items-center gap-1 justify-end mt-0.5">
                  <Calendar class="h-3 w-3" />
                  {{ formatDate(order.created_at) }}
                </p>
              </div>
            </div>

            <Separator />

            <!-- Item-item pesanan -->
            <ul class="space-y-1">
              <li
                v-for="item in order.keranjangs"
                :key="item.id"
                class="flex justify-between text-sm"
              >
                <span class="text-muted-foreground">
                  {{ item.products.nama }}
                  <span class="ml-1">×{{ item.jumlah_pemesanan }}</span>
                  <span v-if="item.keterangan" class="italic ml-1 text-xs">
                    ({{ item.keterangan }})
                  </span>
                </span>
                <span>Rp {{ formatPrice(item.products.harga * item.jumlah_pemesanan) }}</span>
              </li>
            </ul>
          </div>
        </div>

      </CardContent>
    </Card>

  </div>
</template>
