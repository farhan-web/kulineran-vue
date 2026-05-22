<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { CheckCircle, Home, UtensilsCrossed, Copy, CreditCard } from '@lucide/vue'
import { useCartStore } from '@/stores/cartStore'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'

const cartStore = useCartStore()

/** Salin nomor VA ke clipboard */
function copyVa() {
  if (!cartStore.lastOrder?.vaNumber) return
  navigator.clipboard.writeText(cartStore.lastOrder.vaNumber)
  toast.success('Nomor VA berhasil disalin')
}
</script>

<template>
  <main class="container py-20">
    <div class="flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
      <div class="relative">
        <img
          src="/assets/images/menunggu.png"
          alt="Menunggu pesanan"
          class="h-48 w-auto mx-auto"
        />
        <CheckCircle class="absolute -bottom-2 -right-2 h-10 w-10 text-primary bg-background rounded-full" />
      </div>

      <div class="space-y-2">
        <h1 class="text-3xl font-bold text-primary">Pesanan Berhasil!</h1>
        <p class="text-muted-foreground">
          Selesaikan pembayaran untuk mulai memproses pesanan Anda.
        </p>
      </div>

      <!-- Card VA Number -->
      <Card v-if="cartStore.lastOrder" class="w-full text-left">
        <CardContent class="p-5 space-y-4">
          <div class="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <CreditCard class="h-4 w-4" />
            {{ cartStore.lastOrder.metodeBayar }} Virtual Account
          </div>

          <div>
            <p class="text-xs text-muted-foreground mb-1">Nomor Virtual Account</p>
            <div class="flex items-center gap-2">
              <p class="text-2xl font-bold tracking-widest font-mono">
                {{ cartStore.lastOrder.vaNumber }}
              </p>
              <Button variant="ghost" size="icon" class="shrink-0" @click="copyVa">
                <Copy class="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          <div class="flex justify-between text-sm">
            <span class="text-muted-foreground">Total Tagihan</span>
            <span class="font-bold text-primary">
              Rp {{ cartStore.formatPrice(
                cartStore.lastOrder.keranjangs.reduce(
                  (sum, item) => sum + item.products.harga * item.jumlah_pemesanan, 0
                )
              ) }}
            </span>
          </div>

          <div class="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1">
            <p class="font-medium text-foreground">Cara Bayar:</p>
            <p>1. Buka aplikasi m-banking atau ATM</p>
            <p>2. Pilih Transfer / Virtual Account</p>
            <p>3. Masukkan nomor VA di atas</p>
            <p>4. Konfirmasi pembayaran dalam <span class="font-medium text-foreground">24 jam</span></p>
          </div>
        </CardContent>
      </Card>

      <div class="flex gap-3">
        <RouterLink to="/">
          <Button variant="outline" class="gap-2">
            <Home class="h-4 w-4" />
            Kembali ke Home
          </Button>
        </RouterLink>
        <RouterLink to="/foods">
          <Button class="gap-2">
            <UtensilsCrossed class="h-4 w-4" />
            Pesan Lagi
          </Button>
        </RouterLink>
      </div>
    </div>
  </main>
</template>
