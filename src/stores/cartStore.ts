// ============================================================
// CART STORE (Pinia)
// Mengelola state keranjang belanja dan proses checkout.
// Dipakai di: CartView, FoodDetailView, Navbar (badge jumlah item)
//
// Pola Setup Store: ref() = state, computed() = getter, function = action
// ============================================================

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { CartItem, OrderResponse, Product } from '@/types'
import { cartApi, orderApi } from '@/api/endpoints'

export const useCartStore = defineStore('cart', () => {
  // ── STATE ────────────────────────────────────────────────

  /** Semua item yang ada di keranjang — diambil dari GET /keranjangs */
  const items = ref<CartItem[]>([])

  /** true saat sedang ada proses API (fetch/add/remove/checkout) */
  const isLoading = ref(false)

  /**
   * Data order terakhir yang berhasil — disimpan agar bisa ditampilkan
   * di halaman sukses (VA number, metode bayar, total).
   * null = belum pernah checkout atau sudah dibersihkan.
   */
  const lastOrder = ref<OrderResponse | null>(null)

  // ── GETTERS (computed) ───────────────────────────────────
  // computed() = nilai yang dihitung otomatis setiap kali dependency-nya berubah
  // Mirip seperti "rumus Excel" — hasilnya reaktif dan cache-friendly

  /**
   * Jumlah item yang ada di keranjang (bukan total kuantitas, tapi jumlah baris).
   * Contoh: 2 jenis makanan berbeda → totalItems = 2
   * Dipakai untuk badge angka di icon keranjang di Navbar.
   */
  const totalItems = computed(() => items.value.length)

  /**
   * Total harga semua item di keranjang dalam rupiah.
   * Rumus: Σ (harga produk × jumlah pemesanan) untuk setiap item.
   *
   * reduce() mengiterasi semua item dan mengakumulasi ke sum:
   *   - sum  : nilai akumulasi, mulai dari 0
   *   - item : item saat ini
   */
  const totalPrice = computed(() =>
    items.value.reduce(
      (sum, item) => sum + item.products.harga * item.jumlah_pemesanan,
      0, // nilai awal sum
    ),
  )

  // ── ACTIONS ──────────────────────────────────────────────

  /**
   * Ambil data keranjang terbaru dari API dan simpan ke state items.
   * Dipanggil saat CartView di-mount, dan setelah add/remove item.
   *
   * Langkah:
   * 1. Set isLoading = true
   * 2. Fetch dari GET /keranjangs
   * 3. Simpan hasilnya ke items
   * 4. Set isLoading = false
   */
  async function fetchCart() {
    isLoading.value = true
    try {
      items.value = await cartApi.getAll()
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Tambahkan produk ke keranjang lalu refresh data keranjang.
   * Dipanggil dari halaman FoodDetail saat user tekan tombol "Tambah ke Keranjang".
   *
   * Langkah:
   * 1. POST ke /keranjangs dengan data produk, jumlah, dan keterangan
   * 2. Fetch ulang keranjang agar state sinkron dengan database
   *
   * @param product    - produk yang ditambahkan
   * @param jumlah     - berapa banyak yang dipesan
   * @param keterangan - catatan tambahan (misal "pedes", "tanpa bawang")
   */
  async function addToCart(product: Product, jumlah: number, keterangan: string) {
    // Step 1: kirim data ke API
    // Backend hanya butuh products: { id } — tidak perlu full Product object
    await cartApi.add({ jumlah_pemesanan: jumlah, keterangan, products: { id: product.id } })
    // Step 2: refresh agar items di state selalu up-to-date
    await fetchCart()
  }

  /**
   * Hapus satu item dari keranjang berdasarkan ID keranjang-nya.
   * Dipanggil dari CartView saat user tekan tombol hapus.
   *
   * Langkah:
   * 1. DELETE ke /keranjangs/:id
   * 2. Fetch ulang keranjang agar state sinkron
   *
   * @param id - ID record keranjang (bukan ID produk)
   */
  async function removeFromCart(id: number) {
    // Step 1: hapus dari API
    await cartApi.remove(id)
    // Step 2: refresh state
    await fetchCart()
  }

  /**
   * Proses checkout: validasi stok → buat pesanan → kosongkan keranjang.
   * Dipanggil dari CartView saat user submit form dengan metode bayar.
   *
   * Langkah:
   * 1. Kirim data pesanan + metodeBayar ke POST /pesanans
   *    → Backend cek stok, deduct, generate VA, buat order
   * 2. Simpan response (VA number) ke lastOrder
   * 3. Hapus SEMUA item keranjang dari API secara paralel
   * 4. Kosongkan items di state lokal
   *
   * @param nama        - nama pelanggan
   * @param noMeja      - nomor meja pelanggan
   * @param metodeBayar - metode pembayaran: "BCA", "Mandiri", "BNI"
   */
  async function checkout(nama: string, noMeja: string, metodeBayar: string) {
    // Step 1: buat record pesanan — backend akan validasi & deduct stok, generate VA
    const order = await orderApi.create({ nama, noMeja, keranjangs: items.value, metodeBayar })

    // Step 2: simpan info order untuk ditampilkan di halaman sukses
    lastOrder.value = order

    // Step 3: hapus semua item keranjang secara paralel
    await Promise.all(items.value.map((item) => cartApi.remove(item.id)))

    // Step 4: kosongkan state lokal agar UI langsung update tanpa fetch ulang
    items.value = []
  }

  /**
   * Format angka harga ke format ribuan Indonesia.
   * Contoh: 12000 → "12.000", 150000 → "150.000"
   *
   * Intl.NumberFormat adalah API bawaan browser (tidak perlu library tambahan).
   * 'id-ID' = locale Indonesia (pemisah ribuan pakai titik, bukan koma).
   *
   * @param price - harga dalam angka (rupiah)
   * @returns string harga yang sudah diformat
   */
  function formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID').format(price)
  }

  // Expose semua state, getter, dan action agar bisa dipakai di komponen
  return {
    items,
    isLoading,
    lastOrder,
    totalItems,
    totalPrice,
    fetchCart,
    addToCart,
    removeFromCart,
    checkout,
    formatPrice,
  }
})
