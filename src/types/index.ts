// ============================================================
// TYPES / INTERFACES
// Semua tipe data terpusat di sini agar tidak duplikat di file lain.
// Gunakan: import type { NamaTipe } from '@/types'
// ============================================================

/**
 * Data satu produk makanan yang datang dari API.
 * Dipakai di halaman Home, Foods, FoodDetail, dan keranjang.
 */
export interface Product {
  /** ID unik produk dari database */
  id: number
  /** Nama makanan, contoh: "Nasi Goreng Spesial" */
  nama: string
  /** Harga dalam rupiah, contoh: 15000 */
  harga: number
  /** Full URL gambar dari backend, contoh: "http://localhost:8080/images/nasi-goreng.jpg" */
  gambar: string
  /** Deskripsi makanan — opsional (tanda ? = boleh tidak ada) */
  deskripsi?: string
  /** Kategori makanan, contoh: "Nasi", "Mie", "Minuman" — opsional */
  kategori?: string
  /** Jumlah stok yang tersedia. 0 = stok habis */
  stok: number
}

/**
 * Satu item yang ada di dalam keranjang belanja.
 * Berisi info jumlah & keterangan, plus data produknya (nested).
 */
export interface CartItem {
  /** ID record keranjang (BUKAN id produk) — dipakai untuk delete */
  id: number
  /** Berapa banyak produk ini dipesan */
  jumlah_pemesanan: number
  /** Catatan tambahan dari pelanggan, contoh: "pedes", "tanpa bawang" */
  keterangan: string
  /** Data produk lengkap (nested object, bukan hanya id) */
  products: Product
}

/**
 * Data yang dikirim ke API saat pelanggan checkout.
 * Dikirim ke POST /pesanans.
 */
export interface OrderPayload {
  /** Nama pelanggan */
  nama: string
  /** Nomor meja pelanggan */
  noMeja: string
  /** Semua item keranjang yang dipesan */
  keranjangs: CartItem[]
  /** Metode pembayaran: "BCA", "Mandiri", atau "BNI" */
  metodeBayar: string
}

// ── ORDER RESPONSE (dari GET /pesanans) ──────────────────────

/** Satu item dalam pesanan yang sudah selesai — dari OrderItemResponse backend */
export interface OrderItemResponse {
  id: number
  jumlah_pemesanan: number
  keterangan: string
  products: Product
}

export interface OrderResponse {
  id: number
  nama: string
  noMeja: string
  keranjangs: OrderItemResponse[]
  /** Metode pembayaran yang dipilih */
  metodeBayar: string
  /** Nomor Virtual Account untuk pembayaran */
  vaNumber: string
  created_at: string
}

// ── AUTH ──────────────────────────────────────────────────────

export interface LoginPayload {
  username: string
  password: string
}

export interface RegisterPayload {
  username: string
  password: string
}

export interface AuthUser {
  id: number
  username: string
  role: string
}

export interface LoginResponse {
  token: string
  user: AuthUser
}

/**
 * Data form untuk create/update produk oleh admin.
 * Dikirim sebagai FormData (multipart) karena ada file gambar.
 */
export interface ProductRequest {
  nama: string
  harga: number
  deskripsi?: string
  kategori?: string
  isBest: boolean
  /** Jumlah stok awal atau stok yang diupdate */
  stok: number
  /** File gambar — wajib saat create, opsional saat update */
  gambar?: File
}

/**
 * Data yang dikirim ke API saat menambahkan item ke keranjang.
 * Dikirim ke POST /keranjangs.
 * Backend hanya butuh products.id — tidak perlu full Product object.
 */
export interface AddToCartPayload {
  /** Jumlah yang dipesan */
  jumlah_pemesanan: number
  /** Catatan tambahan dari pelanggan */
  keterangan: string
  /** Backend hanya membaca field `id` dari objek ini */
  products: Pick<Product, 'id'>
}
