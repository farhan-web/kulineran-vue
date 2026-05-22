// ============================================================
// API ENDPOINTS
// Semua fungsi pemanggil HTTP request dikumpulkan di sini.
// Store tidak boleh pakai axios langsung — harus lewat file ini.
// Pola: apiClient.METHOD<TipeReturn>(url).then((r) => r.data)
//   → .then((r) => r.data) supaya caller langsung dapat datanya,
//     bukan response object Axios yang punya wrapper {data, status, ...}
// ============================================================

import type { AddToCartPayload, CartItem, LoginPayload, LoginResponse, OrderPayload, OrderResponse, Product, ProductRequest, RegisterPayload } from '@/types'
import apiClient from './client'

// ─────────────────────────────────────────────────────────────
// AUTH API
// ─────────────────────────────────────────────────────────────

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<LoginResponse>('/auth/login', payload).then((r) => r.data),

  register: (payload: RegisterPayload) =>
    apiClient.post<{ message: string }>('/auth/register', payload).then((r) => r.data),
}

// ─────────────────────────────────────────────────────────────
// FOOD API — endpoint untuk data produk makanan
// ─────────────────────────────────────────────────────────────

export const foodApi = {
  /**
   * Ambil daftar produk unggulan untuk ditampilkan di halaman Home.
   * GET /best-products → mengembalikan Product[]
   */
  getBestProducts: () =>
    apiClient.get<Product[]>('/best-products').then((r) => r.data),

  /**
   * Ambil semua produk, dengan opsi filter pencarian.
   * GET /products          → semua produk
   * GET /products?q=bakso  → produk yang cocok dengan kata "bakso"
   *   (json-server otomatis filter semua field berdasarkan nilai q)
   *
   * @param query - kata kunci pencarian (opsional)
   */
  getAll: (query?: string) => {
    // Jika ada query, tambahkan sebagai query param ?q=...
    // Jika tidak ada, kirim tanpa param (ambil semua)
    const params = query ? { q: query } : {}
    return apiClient.get<Product[]>('/products', { params }).then((r) => r.data)
  },

  /**
   * Ambil satu produk berdasarkan ID-nya.
   * GET /products/:id → mengembalikan satu objek Product
   *
   * @param id - ID produk yang ingin diambil
   */
  getById: (id: number) =>
    apiClient.get<Product>(`/products/${id}`).then((r) => r.data),
}

// ─────────────────────────────────────────────────────────────
// CART API — endpoint untuk keranjang belanja (/keranjangs)
// ─────────────────────────────────────────────────────────────

export const cartApi = {
  /**
   * Ambil semua item yang ada di keranjang.
   * GET /keranjangs → mengembalikan CartItem[]
   */
  getAll: () =>
    apiClient.get<CartItem[]>('/keranjangs').then((r) => r.data),

  /**
   * Tambahkan satu item baru ke keranjang.
   * POST /keranjangs dengan body AddToCartPayload → mengembalikan CartItem yang baru dibuat
   *
   * @param payload - data item yang ditambahkan (jumlah, keterangan, produk)
   */
  add: (payload: AddToCartPayload) =>
    apiClient.post<CartItem>('/keranjangs', payload).then((r) => r.data),

  /**
   * Hapus satu item dari keranjang berdasarkan ID keranjang (bukan ID produk).
   * DELETE /keranjangs/:id
   *
   * @param id - ID record keranjang yang ingin dihapus
   */
  remove: (id: number) =>
    apiClient.delete(`/keranjangs/${id}`).then((r) => r.data),
}

// ─────────────────────────────────────────────────────────────
// ORDER API — endpoint untuk pemesanan (/pesanans)
// ─────────────────────────────────────────────────────────────

export const orderApi = {
  /**
   * Buat pesanan baru (dipanggil saat checkout).
   * POST /pesanans dengan body OrderPayload
   *
   * @param payload - nama pelanggan, nomor meja, dan semua item keranjang
   */
  getAll: () =>
    apiClient.get<OrderResponse[]>('/pesanans').then((r) => r.data),

  create: (payload: OrderPayload) =>
    apiClient.post('/pesanans', payload).then((r) => r.data),
}

// ─────────────────────────────────────────────────────────────
// ADMIN API — CRUD produk, hanya bisa diakses ROLE_ADMIN
// ─────────────────────────────────────────────────────────────

/** Konversi ProductRequest ke FormData untuk dikirim sebagai multipart */
function toFormData(req: ProductRequest): FormData {
  const form = new FormData()
  form.append('nama', req.nama)
  form.append('harga', String(req.harga))
  form.append('isBest', String(req.isBest))
  form.append('stok', String(req.stok))
  if (req.deskripsi) form.append('deskripsi', req.deskripsi)
  if (req.kategori) form.append('kategori', req.kategori)
  if (req.gambar) form.append('gambar', req.gambar)
  return form
}

export const adminApi = {
  /** GET /admin/products — ambil semua produk */
  getAll: () =>
    apiClient.get<Product[]>('/admin/products').then((r) => r.data),

  /** POST /admin/products — buat produk baru (multipart/form-data) */
  create: (req: ProductRequest) =>
    apiClient.post<Product>('/admin/products', toFormData(req), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),

  /** PUT /admin/products/:id — update produk (multipart/form-data) */
  update: (id: number, req: ProductRequest) =>
    apiClient.put<Product>(`/admin/products/${id}`, toFormData(req), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),

  /** DELETE /admin/products/:id — hapus produk */
  remove: (id: number) =>
    apiClient.delete(`/admin/products/${id}`).then((r) => r.data),
}
