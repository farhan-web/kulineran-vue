// ============================================================
// ADMIN STORE (Pinia)
// Mengelola state untuk halaman admin: CRUD produk.
// Hanya dipakai di views admin — tidak dipakai oleh user biasa.
// ============================================================

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product, ProductRequest } from '@/types'
import { adminApi } from '@/api/endpoints'

export const useAdminStore = defineStore('admin', () => {
  // ── STATE ────────────────────────────────────────────────

  /** Daftar semua produk untuk tabel di halaman admin */
  const products = ref<Product[]>([])

  /** true saat sedang ada proses API */
  const isLoading = ref(false)

  /** Pesan error dari API */
  const error = ref<string | null>(null)

  // ── ACTIONS ──────────────────────────────────────────────

  /** Ambil semua produk dari GET /admin/products */
  async function fetchProducts() {
    isLoading.value = true
    error.value = null
    try {
      products.value = await adminApi.getAll()
    } catch {
      error.value = 'Gagal memuat produk'
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Buat produk baru, lalu refresh daftar produk.
   * @param req - data produk + file gambar
   */
  async function createProduct(req: ProductRequest) {
    isLoading.value = true
    error.value = null
    try {
      await adminApi.create(req)
      await fetchProducts()
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Update produk, lalu refresh daftar produk.
   * @param id  - ID produk yang diupdate
   * @param req - data baru + optional file gambar baru
   */
  async function updateProduct(id: number, req: ProductRequest) {
    isLoading.value = true
    error.value = null
    try {
      await adminApi.update(id, req)
      await fetchProducts()
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Hapus produk berdasarkan ID, lalu refresh daftar produk.
   * @param id - ID produk yang dihapus
   */
  async function deleteProduct(id: number) {
    isLoading.value = true
    error.value = null
    try {
      await adminApi.remove(id)
      // Hapus dari state lokal langsung tanpa fetch ulang (lebih cepat)
      products.value = products.value.filter(p => p.id !== id)
    } finally {
      isLoading.value = false
    }
  }

  return { products, isLoading, error, fetchProducts, createProduct, updateProduct, deleteProduct }
})
