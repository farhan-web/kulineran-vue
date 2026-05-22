# 11 — Views / Halaman

---

## HomeView.vue

**Route:** `/`
**File:** `src/views/HomeView.vue`

Halaman utama yang menampilkan hero section dan 3 produk unggulan.

```vue
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
  foodStore.fetchBestProducts()   // ambil produk unggulan saat komponen mount
})
</script>

<template>
  <main>
    <!-- ── HERO SECTION ──────────────────────────── -->
    <section class="bg-gradient-to-br from-primary/5 via-background to-background py-16 md:py-24">
      <div class="container">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <!-- Teks -->
          <div class="space-y-6">
            <h1 class="text-4xl md:text-5xl font-bold leading-tight">
              Delicious Food Menu,
              <span class="text-primary">in Your Gadget</span>
            </h1>
            <p class="text-lg text-muted-foreground">...</p>
            <RouterLink to="/foods">
              <Button size="lg" class="gap-2">
                <ArrowRight class="h-5 w-5" />
                Lihat Menu
              </Button>
            </RouterLink>
          </div>
          <!-- Gambar hero -->
          <div class="flex justify-center">
            <img src="/assets/images/hero.png" ... />
          </div>
        </div>
      </div>
    </section>

    <!-- ── BEST PRODUCTS SECTION ──────────────────── -->
    <section class="container py-16">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl font-bold">Best <span class="text-primary">Foods</span></h2>
          <p class="text-muted-foreground mt-1">Menu pilihan terbaik kami</p>
        </div>
        <RouterLink to="/foods">
          <Button variant="outline">Lihat Semua</Button>
        </RouterLink>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <!-- Skeleton saat loading -->
        <template v-if="foodStore.isLoading">
          <FoodCardSkeleton v-for="n in 3" :key="n" />
        </template>
        <!-- Data sudah ada -->
        <template v-else>
          <FoodCard
            v-for="product in foodStore.bestProducts"
            :key="product.id"
            :product="product"
          />
        </template>
      </div>
    </section>
  </main>
</template>
```

**Alur data:**
```
onMounted → foodStore.fetchBestProducts() → foodApi.getBestProducts()
         → GET /best-products → foodStore.bestProducts diupdate
         → v-for render FoodCard untuk tiap produk
```

---

## FoodsView.vue

**Route:** `/foods`
**File:** `src/views/FoodsView.vue`

Halaman daftar semua makanan dengan fitur pencarian real-time.

```vue
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { Search } from '@lucide/vue'
import { useFoodStore } from '@/stores/foodStore'
import FoodCard from '@/components/food/FoodCard.vue'
import FoodCardSkeleton from '@/components/food/FoodCardSkeleton.vue'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@vueuse/core'

const foodStore = useFoodStore()
const searchInput = ref('')                          // nilai input saat ini
const debouncedSearch = useDebounce(searchInput, 400)  // delay 400ms setelah berhenti ketik

// Watch perubahan debouncedSearch → fetch ulang data
watch(debouncedSearch, (query) => {
  foodStore.fetchProducts(query || undefined)
})

onMounted(() => {
  foodStore.fetchProducts()   // load semua produk saat pertama buka
})
</script>

<template>
  <main class="container py-10">
    <!-- Search bar -->
    <div class="relative mb-8 max-w-md">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input v-model="searchInput" placeholder="Cari makanan..." class="pl-9" />
    </div>

    <!-- Grid produk (4 kolom di desktop) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <template v-if="foodStore.isLoading">
        <FoodCardSkeleton v-for="n in 8" :key="n" />
      </template>
      <template v-else>
        <FoodCard v-for="product in foodStore.products" :key="product.id" :product="product" />
      </template>
    </div>

    <!-- Empty state -->
    <div v-if="!foodStore.isLoading && foodStore.products.length === 0" class="text-center py-20">
      <img src="/assets/images/menunggu.png" class="mx-auto mb-4 h-40 w-auto opacity-50" />
      <h3 class="font-semibold text-lg">Makanan tidak ditemukan</h3>
    </div>
  </main>
</template>
```

**Konsep penting — Debounce:**

```
User ketik "b"       → searchInput = "b"       → belum fetch (masih 400ms)
User ketik "a"       → searchInput = "ba"      → belum fetch (timer reset)
User ketik "k"       → searchInput = "bak"     → belum fetch (timer reset)
User ketik "s"       → searchInput = "baks"    → belum fetch (timer reset)
User ketik "o"       → searchInput = "bakso"   → belum fetch (timer reset)
400ms berlalu        → debouncedSearch = "bakso" → FETCH /products?q=bakso
```

Tanpa debounce, setiap ketikan akan trigger fetch → sangat boros request API.

---

## FoodDetailView.vue

**Route:** `/foods/:id`
**File:** `src/views/FoodDetailView.vue`

Halaman detail produk dengan form pemesanan.

```vue
<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ShoppingCart, Loader2 } from '@lucide/vue'
import { useFoodStore } from '@/stores/foodStore'
import { useCartStore } from '@/stores/cartStore'
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

// reactive() untuk form object (vs ref() untuk nilai primitif)
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
  // Ambil ID dari URL parameter dan fetch data produk
  foodStore.fetchProductById(Number(route.params.id))
})

async function handleOrder() {
  // Validasi form
  if (!form.jumlah_pemesanan || form.jumlah_pemesanan < 1) {
    toast.error('Jumlah pesanan harus diisi')
    return
  }
  if (!foodStore.currentProduct) return

  try {
    await cartStore.addToCart(foodStore.currentProduct, form.jumlah_pemesanan, form.keterangan)
    toast.success('Sukses masuk keranjang!')
    router.push('/keranjang')    // redirect ke halaman keranjang
  } catch {
    toast.error('Gagal menambahkan ke keranjang')
  }
}
</script>

<template>
  <main class="container py-10">
    <Breadcrumb :items="breadcrumbs" class="mb-6" />

    <!-- Loading spinner -->
    <div v-if="foodStore.isLoading" class="flex items-center justify-center py-20">
      <Loader2 class="h-8 w-8 animate-spin text-primary" />
    </div>

    <!-- Konten (2 kolom: gambar | detail+form) -->
    <div v-else-if="foodStore.currentProduct" class="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div>
        <img
          :src="`/assets/images/${foodStore.currentProduct.gambar}`"
          class="w-full rounded-2xl shadow-lg object-cover aspect-[4/3]"
        />
      </div>

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
        </div>

        <!-- Form pesan -->
        <form class="space-y-4" @submit.prevent="handleOrder">
          <div class="space-y-2">
            <label for="jumlah">Jumlah Pesanan</label>
            <Input id="jumlah" v-model="form.jumlah_pemesanan" type="number" :min="1" />
          </div>

          <div class="space-y-2">
            <label for="keterangan">Keterangan (opsional)</label>
            <Textarea id="keterangan" v-model="form.keterangan" placeholder="Contoh: Pedes..." />
          </div>

          <Button type="submit" size="lg" class="w-full" :disabled="cartStore.isLoading">
            <Loader2 v-if="cartStore.isLoading" class="h-4 w-4 animate-spin" />
            <ShoppingCart v-else class="h-4 w-4" />
            Tambah ke Keranjang
          </Button>
        </form>
      </div>
    </div>

    <!-- Not found -->
    <div v-else class="text-center py-20 text-muted-foreground">
      Makanan tidak ditemukan.
    </div>
  </main>
</template>
```

**Pola v-if / v-else-if / v-else:**
```
isLoading = true   → tampilkan spinner
isLoading = false + ada data   → tampilkan konten
isLoading = false + tidak ada data  → tampilkan "tidak ditemukan"
```

---

## CartView.vue

**Route:** `/keranjang`
**File:** `src/views/CartView.vue`

Halaman keranjang dengan ringkasan pesanan dan form checkout.

```vue
<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Trash2, ShoppingCart, Loader2, ShoppingBag } from '@lucide/vue'
import { useCartStore } from '@/stores/cartStore'
import { toast } from 'vue-sonner'
import Breadcrumb from '@/components/common/Breadcrumb.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const router = useRouter()
const cartStore = useCartStore()

const checkoutForm = reactive({ nama: '', noMeja: '' })

onMounted(() => {
  cartStore.fetchCart()
})

async function handleDelete(id: number) {
  try {
    await cartStore.removeFromCart(id)
    toast.error('Item dihapus dari keranjang')   // toast merah untuk hapus
  } catch {
    toast.error('Gagal menghapus item')
  }
}

async function handleCheckout() {
  // Validasi
  if (!checkoutForm.nama.trim() || !checkoutForm.noMeja.trim()) {
    toast.error('Nama dan Nomor Meja harus diisi')
    return
  }
  if (cartStore.items.length === 0) {
    toast.error('Keranjang masih kosong')
    return
  }

  try {
    await cartStore.checkout(checkoutForm.nama, checkoutForm.noMeja)
    toast.success('Pesanan berhasil dibuat!')
    router.push('/pesanan-sukses')
  } catch {
    toast.error('Gagal melakukan pemesanan')
  }
}
</script>
```

**Layout halaman keranjang — 3 kolom grid:**
```
┌─────────────────────────────────┬──────────────────┐
│     Cart Items (lg:col-span-2)  │ Order Summary    │
│                                 │                  │
│  ┌──────────────────────────┐   │ ┌──────────────┐ │
│  │ Item 1                   │   │ │ Ringkasan    │ │
│  │ Item 2                   │   │ └──────────────┘ │
│  │ Item 3                   │   │ ┌──────────────┐ │
│  └──────────────────────────┘   │ │ Form Checkout│ │
│                                 │ └──────────────┘ │
└─────────────────────────────────┴──────────────────┘
```

Di mobile (< 1024px), keduanya stack vertikal (kolom tunggal).

**Alur Checkout:**
```
handleCheckout()
  → validasi form
  → cartStore.checkout(nama, noMeja)
    → POST /pesanans (simpan pesanan)
    → DELETE /keranjangs/:id × (jumlah item) secara paralel
    → items.value = [] (kosongkan state lokal)
  → router.push('/pesanan-sukses')
```

---

## OrderSuccessView.vue

**Route:** `/pesanan-sukses`
**File:** `src/views/OrderSuccessView.vue`

Halaman konfirmasi setelah checkout berhasil. Simple dan tidak ada fetch data.

```vue
<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { CheckCircle, Home, UtensilsCrossed } from '@lucide/vue'
import { Button } from '@/components/ui/button'
</script>

<template>
  <main class="container py-20">
    <div class="flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
      <!-- Gambar + icon checkmark di pojok -->
      <div class="relative">
        <img src="/assets/images/menunggu.png" class="h-48 w-auto mx-auto" />
        <CheckCircle class="absolute -bottom-2 -right-2 h-10 w-10 text-primary bg-background rounded-full" />
      </div>

      <div class="space-y-2">
        <h1 class="text-3xl font-bold text-primary">Pesanan Berhasil!</h1>
        <p class="text-muted-foreground">Pesanan Anda sedang diproses...</p>
      </div>

      <!-- Dua tombol aksi -->
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
```

---

## Ringkasan Pola yang Digunakan di Semua Views

| Pola | Dipakai di |
|------|-----------|
| `onMounted(() => store.fetch())` | Semua view yang butuh data |
| `v-if="isLoading"` + skeleton | HomeView, FoodsView, FoodDetailView |
| `v-if / v-else-if / v-else` | FoodDetailView (loading / ada data / not found) |
| `reactive()` untuk form | FoodDetailView, CartView |
| `toast.success/error()` | FoodDetailView, CartView |
| `router.push()` setelah aksi | FoodDetailView (→ keranjang), CartView (→ sukses) |
| `Breadcrumb` | FoodDetailView, CartView |
