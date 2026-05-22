# 06 — Pinia Stores

Pinia adalah state management resmi untuk Vue 3. Project ini punya dua store: `foodStore` dan `cartStore`.

---

## Setup Pinia di main.ts

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())   // daftarkan Pinia ke aplikasi
app.use(router)

app.mount('#app')
```

---

## Pola Store yang Dipakai: Setup Store

Pinia punya dua cara bikin store: **Options Store** dan **Setup Store**.
Project ini pakai **Setup Store** karena lebih mirip dengan Composition API Vue 3.

```ts
// Pola Setup Store
export const useNamaStore = defineStore('nama', () => {
  // state → ref() atau reactive()
  // getters → computed()
  // actions → function biasa atau async function

  return { /* expose */ }
})
```

---

## foodStore.ts

```ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from '@/types'
import { foodApi } from '@/api/endpoints'

export const useFoodStore = defineStore('food', () => {
  // ── STATE ─────────────────────────────────────────
  const products = ref<Product[]>([])          // semua produk (halaman Foods)
  const bestProducts = ref<Product[]>([])       // produk unggulan (halaman Home)
  const currentProduct = ref<Product | null>(null)  // produk yang sedang dilihat
  const isLoading = ref(false)                  // loading state global
  const searchQuery = ref('')                   // query pencarian saat ini

  // ── ACTIONS ───────────────────────────────────────
  async function fetchBestProducts() {
    isLoading.value = true
    try {
      bestProducts.value = await foodApi.getBestProducts()
    } finally {
      isLoading.value = false    // finally: loading false meskipun error
    }
  }

  async function fetchProducts(query?: string) {
    isLoading.value = true
    try {
      products.value = await foodApi.getAll(query)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchProductById(id: number) {
    isLoading.value = true
    try {
      currentProduct.value = await foodApi.getById(id)
    } finally {
      isLoading.value = false
    }
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  // expose semua state dan action
  return {
    products, bestProducts, currentProduct, isLoading, searchQuery,
    fetchBestProducts, fetchProducts, fetchProductById, setSearchQuery,
  }
})
```

**Kenapa `finally` bukan `catch`?**
`finally` selalu jalan baik request sukses maupun gagal, memastikan `isLoading` selalu kembali ke `false`. Tanpa ini, kalau request error, loading spinner tidak akan berhenti.

---

## cartStore.ts

```ts
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { CartItem, Product } from '@/types'
import { cartApi, orderApi } from '@/api/endpoints'

export const useCartStore = defineStore('cart', () => {
  // ── STATE ─────────────────────────────────────────
  const items = ref<CartItem[]>([])
  const isLoading = ref(false)

  // ── GETTERS (computed) ────────────────────────────
  const totalItems = computed(() => items.value.length)

  const totalPrice = computed(() =>
    items.value.reduce(
      (sum, item) => sum + item.products.harga * item.jumlah_pemesanan,
      0,
    ),
  )

  // ── ACTIONS ───────────────────────────────────────
  async function fetchCart() {
    isLoading.value = true
    try {
      items.value = await cartApi.getAll()
    } finally {
      isLoading.value = false
    }
  }

  async function addToCart(product: Product, jumlah: number, keterangan: string) {
    await cartApi.add({ jumlah_pemesanan: jumlah, keterangan, products: product })
    await fetchCart()    // refresh data keranjang setelah tambah
  }

  async function removeFromCart(id: number) {
    await cartApi.remove(id)
    await fetchCart()    // refresh data keranjang setelah hapus
  }

  async function checkout(nama: string, noMeja: string) {
    // 1. Buat pesanan
    await orderApi.create({ nama, noMeja, keranjangs: items.value })
    // 2. Hapus semua item keranjang secara paralel (Promise.all)
    await Promise.all(items.value.map((item) => cartApi.remove(item.id)))
    // 3. Reset state lokal
    items.value = []
  }

  // Helper format angka ke format rupiah: 12000 → "12.000"
  function formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID').format(price)
  }

  return {
    items, isLoading, totalItems, totalPrice,
    fetchCart, addToCart, removeFromCart, checkout, formatPrice,
  }
})
```

---

## Penjelasan Getter dengan `computed()`

```ts
const totalPrice = computed(() =>
  items.value.reduce(
    (sum, item) => sum + item.products.harga * item.jumlah_pemesanan,
    0,
  ),
)
```

- `computed()` = nilai yang dihitung ulang otomatis kalau dependency berubah
- `reduce()` = iterasi semua item, akumulasi ke dalam `sum` mulai dari `0`
- Hasilnya reaktif: tiap kali `items` berubah, `totalPrice` otomatis update

---

## `Promise.all()` di Checkout

```ts
await Promise.all(items.value.map((item) => cartApi.remove(item.id)))
```

- `map()` membuat array of Promises (satu Promise per item)
- `Promise.all()` menjalankan semuanya **secara paralel** (bukan satu-satu)
- Ini lebih cepat daripada `for` loop dengan `await`

---

## Cara Pakai Store di Component

```vue
<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore'
import { useFoodStore } from '@/stores/foodStore'

const cartStore = useCartStore()
const foodStore = useFoodStore()
</script>

<template>
  <!-- Akses state -->
  <p>Total: {{ cartStore.totalItems }} item</p>

  <!-- Panggil action -->
  <button @click="cartStore.fetchCart()">Refresh</button>
</template>
```

Store bisa dipanggil di komponen manapun. Pinia memastikan semua komponen berbagi state yang sama.

---

## `Intl.NumberFormat` untuk Format Rupiah

```ts
function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID').format(price)
}

formatPrice(12000)   // → "12.000"
formatPrice(150000)  // → "150.000"
```

`Intl.NumberFormat` adalah API bawaan browser yang bisa format angka sesuai locale. `'id-ID'` = Indonesian locale (pemisah ribuan pakai titik).
