<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ShoppingCart, Loader2 } from '@lucide/vue'
import { useFoodStore } from '@/stores/foodStore'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'vue-sonner'
import Breadcrumb from '@/components/common/Breadcrumb.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'

const route = useRoute()
const router = useRouter()
const foodStore = useFoodStore()
const cartStore = useCartStore()
const authStore = useAuthStore()

const form = reactive({
  jumlah_pemesanan: 1,
  keterangan: '',
})

const breadcrumbs = [
  { label: 'Home', to: '/' },
  { label: 'Menu', to: '/foods' },
  { label: 'Detail Makanan' },
]

onMounted(() => {
  foodStore.fetchProductById(Number(route.params.id))
})

async function handleOrder() {
  // Cek login dulu — kalau belum, redirect ke login dengan menyimpan halaman ini
  if (!authStore.isLoggedIn) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }

  if (!form.jumlah_pemesanan || form.jumlah_pemesanan < 1) {
    toast.error('Jumlah pesanan harus diisi')
    return
  }
  if (!foodStore.currentProduct) return

  const stok = foodStore.currentProduct.stok
  if (stok <= 0) {
    toast.error('Stok produk ini sudah habis')
    return
  }
  if (form.jumlah_pemesanan > stok) {
    toast.error(`Stok hanya tersisa ${stok} porsi`)
    return
  }

  try {
    await cartStore.addToCart(foodStore.currentProduct, form.jumlah_pemesanan, form.keterangan)
    toast.success('Sukses masuk keranjang!')
    router.push('/keranjang')
  } catch {
    toast.error('Gagal menambahkan ke keranjang')
  }
}
</script>

<template>
  <main class="container py-10">
    <Breadcrumb :items="breadcrumbs" class="mb-6" />

    <!-- Loading -->
    <div v-if="foodStore.isLoading" class="flex items-center justify-center py-20">
      <Loader2 class="h-8 w-8 animate-spin text-primary" />
    </div>

    <!-- Content -->
    <div v-else-if="foodStore.currentProduct" class="grid grid-cols-1 md:grid-cols-2 gap-10">
      <!-- Image -->
      <div>
        <img
          :src="foodStore.currentProduct.gambar"
          :alt="foodStore.currentProduct.nama"
          class="w-full rounded-2xl shadow-lg object-cover aspect-[4/3]"
        />
      </div>

      <!-- Detail & Form -->
      <div class="space-y-6">
        <div>
          <h1 class="text-3xl font-bold">{{ foodStore.currentProduct.nama }}</h1>
          <p v-if="foodStore.currentProduct.deskripsi" class="text-muted-foreground mt-2">
            {{ foodStore.currentProduct.deskripsi }}
          </p>
        </div>

        <Separator />

        <div>
          <p class="text-sm text-muted-foreground">Harga</p>
          <p class="text-2xl font-bold text-primary">
            Rp {{ cartStore.formatPrice(foodStore.currentProduct.harga) }}
          </p>
          <!-- Info stok -->
          <p v-if="foodStore.currentProduct.stok > 0" class="text-sm text-muted-foreground mt-1">
            Sisa {{ foodStore.currentProduct.stok }} porsi
          </p>
          <p v-else class="text-sm text-destructive font-medium mt-1">
            Stok habis
          </p>
        </div>

        <form class="space-y-4" @submit.prevent="handleOrder">
          <div class="space-y-2">
            <label class="text-sm font-medium" for="jumlah">Jumlah Pesanan</label>
            <Input
              id="jumlah"
              v-model="form.jumlah_pemesanan"
              type="number"
              :min="1"
              :max="foodStore.currentProduct.stok"
              placeholder="1"
              :disabled="foodStore.currentProduct.stok === 0"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium" for="keterangan">
              Keterangan
              <span class="text-muted-foreground font-normal">(opsional)</span>
            </label>
            <Textarea
              id="keterangan"
              v-model="form.keterangan"
              placeholder="Contoh: Pedes, nasi setengah..."
              :rows="3"
              :disabled="foodStore.currentProduct.stok === 0"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            class="w-full gap-2"
            :disabled="cartStore.isLoading || foodStore.currentProduct.stok === 0"
          >
            <Loader2 v-if="cartStore.isLoading" class="h-4 w-4 animate-spin" />
            <ShoppingCart v-else class="h-4 w-4" />
            {{ foodStore.currentProduct.stok === 0 ? 'Stok Habis' : 'Tambah ke Keranjang' }}
          </Button>
        </form>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="text-center py-20 text-muted-foreground">
      Makanan tidak ditemukan.
    </div>
  </main>
</template>
