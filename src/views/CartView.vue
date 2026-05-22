<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Trash2, ShoppingCart, Loader2, ShoppingBag, CreditCard } from '@lucide/vue'
import { useCartStore } from '@/stores/cartStore'
import { toast } from 'vue-sonner'
import Breadcrumb from '@/components/common/Breadcrumb.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const router = useRouter()
const cartStore = useCartStore()

const checkoutForm = reactive({
  nama: '',
  noMeja: '',
})

/** Metode pembayaran yang dipilih user */
const selectedPayment = ref('')

const paymentMethods = [
  { value: 'BCA',     label: 'BCA Virtual Account' },
  { value: 'Mandiri', label: 'Mandiri Virtual Account' },
  { value: 'BNI',     label: 'BNI Virtual Account' },
]

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Menu', to: '/foods' },
  { label: 'Keranjang' },
]

onMounted(() => {
  cartStore.fetchCart()
})

async function handleDelete(id: number) {
  try {
    await cartStore.removeFromCart(id)
    toast.error('Item dihapus dari keranjang')
  } catch {
    toast.error('Gagal menghapus item')
  }
}

async function handleCheckout() {
  if (!checkoutForm.nama.trim() || !checkoutForm.noMeja.trim()) {
    toast.error('Nama dan Nomor Meja harus diisi')
    return
  }
  if (!selectedPayment.value) {
    toast.error('Pilih metode pembayaran terlebih dahulu')
    return
  }
  if (cartStore.items.length === 0) {
    toast.error('Keranjang masih kosong')
    return
  }
  try {
    await cartStore.checkout(checkoutForm.nama, checkoutForm.noMeja, selectedPayment.value)
    toast.success('Pesanan berhasil dibuat!')
    router.push('/pesanan-sukses')
  } catch (err: unknown) {
    // Tampilkan pesan error stok dari backend jika ada
    const e = err as { response?: { data?: { message?: string } } }
    toast.error(e.response?.data?.message ?? 'Gagal melakukan pemesanan')
  }
}
</script>

<template>
  <main class="container py-10">
    <Breadcrumb :items="breadcrumbs" class="mb-6" />

    <h1 class="text-2xl font-bold mb-8">
      Keranjang <span class="text-primary">Saya</span>
    </h1>

    <!-- Empty State -->
    <div v-if="!cartStore.isLoading && cartStore.items.length === 0" class="text-center py-20">
      <ShoppingBag class="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
      <h3 class="font-semibold text-lg">Keranjang masih kosong</h3>
      <p class="text-muted-foreground mt-1">Yuk, tambahkan makanan favoritmu!</p>
      <Button class="mt-6" @click="$router.push('/foods')">Lihat Menu</Button>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Cart Items -->
      <div class="lg:col-span-2 space-y-4">
        <div v-if="cartStore.isLoading" class="flex justify-center py-12">
          <Loader2 class="h-8 w-8 animate-spin text-primary" />
        </div>

        <Card v-for="(item, index) in cartStore.items" :key="item.id">
          <CardContent class="p-4">
            <div class="flex gap-4">
              <div class="text-sm text-muted-foreground w-6 pt-1 shrink-0">
                {{ index + 1 }}.
              </div>
              <img
                :src="item.products.gambar"
                :alt="item.products.nama"
                class="h-20 w-20 rounded-lg object-cover shrink-0"
              />
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold truncate">{{ item.products.nama }}</h3>
                <p class="text-sm text-muted-foreground mt-0.5">
                  {{ item.keterangan || '-' }}
                </p>
                <div class="flex items-center justify-between mt-2">
                  <div class="text-sm text-muted-foreground">
                    Rp {{ cartStore.formatPrice(item.products.harga) }}
                    &times; {{ item.jumlah_pemesanan }}
                  </div>
                  <p class="font-bold text-primary">
                    Rp {{ cartStore.formatPrice(item.products.harga * item.jumlah_pemesanan) }}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                class="text-destructive hover:text-destructive shrink-0"
                @click="handleDelete(item.id)"
              >
                <Trash2 class="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Order Summary & Checkout -->
      <div class="space-y-4">
        <!-- Summary -->
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Pesanan</CardTitle>
          </CardHeader>
          <CardContent class="space-y-3">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="flex justify-between text-sm"
            >
              <span class="text-muted-foreground truncate max-w-[60%]">
                {{ item.products.nama }} &times; {{ item.jumlah_pemesanan }}
              </span>
              <span>Rp {{ cartStore.formatPrice(item.products.harga * item.jumlah_pemesanan) }}</span>
            </div>
            <Separator />
            <div class="flex justify-between font-bold">
              <span>Total</span>
              <span class="text-primary">Rp {{ cartStore.formatPrice(cartStore.totalPrice) }}</span>
            </div>
          </CardContent>
        </Card>

        <!-- Checkout Form -->
        <Card>
          <CardHeader>
            <CardTitle>Data Pemesanan</CardTitle>
          </CardHeader>
          <CardContent>
            <form class="space-y-4" @submit.prevent="handleCheckout">
              <div class="space-y-2">
                <label class="text-sm font-medium" for="nama">Nama Anda</label>
                <Input id="nama" v-model="checkoutForm.nama" placeholder="Masukkan nama Anda" />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium" for="nomeja">Nomor Meja</label>
                <Input id="nomeja" v-model="checkoutForm.noMeja" placeholder="Contoh: 5" />
              </div>

              <!-- Metode Pembayaran -->
              <div class="space-y-2">
                <label class="text-sm font-medium flex items-center gap-1.5">
                  <CreditCard class="h-4 w-4" />
                  Metode Pembayaran
                </label>
                <div class="grid gap-2">
                  <label
                    v-for="method in paymentMethods"
                    :key="method.value"
                    class="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors"
                    :class="selectedPayment === method.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'"
                  >
                    <input
                      v-model="selectedPayment"
                      type="radio"
                      :value="method.value"
                      class="accent-primary"
                    />
                    <span class="text-sm font-medium">{{ method.label }}</span>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                class="w-full gap-2"
                :disabled="cartStore.isLoading || cartStore.items.length === 0"
              >
                <Loader2 v-if="cartStore.isLoading" class="h-4 w-4 animate-spin" />
                <ShoppingCart v-else class="h-4 w-4" />
                Bayar Sekarang
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  </main>
</template>
