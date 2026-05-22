// ============================================================
// FOOD STORE (Pinia)
// Mengelola state untuk data produk makanan.
// Dipakai di: HomeView, FoodsView, FoodDetailView
//
// Pola Setup Store: ref() = state, computed() = getter, function = action
// ============================================================

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from '@/types'
import { foodApi } from '@/api/endpoints'

export const useFoodStore = defineStore('food', () => {
  // ── STATE ────────────────────────────────────────────────
  // ref() membuat nilai reaktif — komponen otomatis update saat nilainya berubah

  /** Daftar semua produk yang tampil di halaman Foods */
  const products = ref<Product[]>([])

  /** Daftar produk unggulan yang tampil di halaman Home */
  const bestProducts = ref<Product[]>([])

  /** Produk yang sedang dibuka di halaman FoodDetail. null = belum ada */
  const currentProduct = ref<Product | null>(null)

  /** true saat sedang fetch data dari API — dipakai untuk tampilkan loading spinner */
  const isLoading = ref(false)

  /** Kata kunci pencarian yang sedang aktif di halaman Foods */
  const searchQuery = ref('')

  // ── ACTIONS ──────────────────────────────────────────────

  /**
   * Fetch produk unggulan dari API dan simpan ke bestProducts.
   * Dipanggil saat HomeView di-mount.
   *
   * Langkah:
   * 1. Set isLoading = true (tampilkan loading)
   * 2. Fetch data dari GET /best-products
   * 3. Simpan hasilnya ke bestProducts
   * 4. Set isLoading = false di finally (selalu jalan meski error)
   */
  async function fetchBestProducts() {
    isLoading.value = true
    try {
      // Step 2-3: fetch dan simpan ke state
      bestProducts.value = await foodApi.getBestProducts()
    } finally {
      // Step 4: finally memastikan loading selalu berhenti, bahkan jika request gagal
      isLoading.value = false
    }
  }

  /**
   * Fetch semua produk, dengan opsi filter pencarian.
   * Dipanggil saat FoodsView di-mount, dan saat user mengetik di search box.
   *
   * Langkah:
   * 1. Set isLoading = true
   * 2. Fetch dari GET /products (atau GET /products?q=... jika ada query)
   * 3. Simpan hasilnya ke products
   * 4. Set isLoading = false
   *
   * @param query - kata kunci pencarian (opsional, undefined = ambil semua)
   */
  async function fetchProducts(query?: string) {
    isLoading.value = true
    try {
      products.value = await foodApi.getAll(query)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch satu produk berdasarkan ID dan simpan ke currentProduct.
   * Dipanggil saat FoodDetailView di-mount.
   *
   * Langkah:
   * 1. Set isLoading = true
   * 2. Fetch dari GET /products/:id
   * 3. Simpan hasilnya ke currentProduct
   * 4. Set isLoading = false
   *
   * @param id - ID produk yang ingin ditampilkan
   */
  async function fetchProductById(id: number) {
    isLoading.value = true
    try {
      currentProduct.value = await foodApi.getById(id)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Update nilai searchQuery di state.
   * Dipanggil dari komponen SearchBar saat user mengetik.
   * FoodsView lalu watch searchQuery ini dan memanggil fetchProducts ulang.
   *
   * @param query - kata kunci baru dari input user
   */
  function setSearchQuery(query: string) {
    searchQuery.value = query
  }

  // Expose semua state dan action agar bisa dipakai di komponen
  return {
    products,
    bestProducts,
    currentProduct,
    isLoading,
    searchQuery,
    fetchBestProducts,
    fetchProducts,
    fetchProductById,
    setSearchQuery,
  }
})
