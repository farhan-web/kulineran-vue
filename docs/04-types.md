# 04 — TypeScript Types

File: `src/types/index.ts`

Semua interface/tipe data dikumpulkan di satu file. Ini best practice agar tidak ada duplikasi tipe di berbagai file.

---

## Interface yang Digunakan

```ts
// Data produk makanan dari API
export interface Product {
  id: number
  nama: string
  harga: number
  gambar: string       // nama file gambar, contoh: "nasi-goreng.jpg"
  deskripsi?: string   // opsional, tanda ? artinya boleh tidak ada
  kategori?: string    // opsional
}

// Item di dalam keranjang
export interface CartItem {
  id: number                 // id keranjang (bukan id produk)
  jumlah_pemesanan: number
  keterangan: string         // catatan tambahan, misal "pedes"
  products: Product          // objek produk lengkap (nested)
}

// Payload saat checkout/pesan
export interface OrderPayload {
  nama: string               // nama pelanggan
  noMeja: string             // nomor meja
  keranjangs: CartItem[]     // semua item keranjang
}

// Payload saat tambah ke keranjang
export interface AddToCartPayload {
  jumlah_pemesanan: number
  keterangan: string
  products: Product
}
```

---

## Cara Pakai

Import di file manapun yang butuh:

```ts
import type { Product, CartItem } from '@/types'

// Contoh: definisi props komponen
defineProps<{ product: Product }>()

// Contoh: definisi state
const items = ref<CartItem[]>([])
const currentProduct = ref<Product | null>(null)
```

---

## Kenapa `import type`?

`import type` hanya mengimport di level TypeScript, tidak masuk ke bundle JavaScript. Ini lebih efisien karena type hilang saat compile.

```ts
import type { Product } from '@/types'  // ✅ hanya untuk type checking
import { Product } from '@/types'       // ❌ ini akan error karena interface bukan value
```

---

## Hubungan Antar Interface

```
Product
  └── dipakai oleh CartItem (field: products)
  └── dipakai oleh AddToCartPayload (field: products)

CartItem
  └── dipakai oleh OrderPayload (field: keranjangs[])

OrderPayload
  └── dikirim ke POST /pesanans saat checkout
```
