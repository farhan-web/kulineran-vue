# 05 — API Layer

API layer terdiri dari dua file di `src/api/`:
- `client.ts` — instance Axios yang sudah dikonfigurasi
- `endpoints.ts` — semua fungsi untuk memanggil endpoint API

---

## client.ts

```ts
import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default apiClient
```

**Penjelasan:**
- `axios.create()` membuat instance Axios dengan konfigurasi default
- `baseURL` dibaca dari environment variable. Kalau tidak ada, fallback ke `localhost:3000`
- `headers` otomatis di-set ke JSON untuk semua request
- Semua endpoint di `endpoints.ts` menggunakan instance ini (bukan `axios` langsung)

**Kenapa dipisah dari endpoints?**
Kalau nanti mau ganti base URL, tambah interceptor (misal untuk auth token), atau ganti library HTTP, cukup edit `client.ts` — tidak perlu sentuh `endpoints.ts`.

---

## endpoints.ts

```ts
import type { AddToCartPayload, CartItem, OrderPayload, Product } from '@/types'
import apiClient from './client'

// ─────────────────────────────────────────────────
// FOOD API
// ─────────────────────────────────────────────────

export const foodApi = {
  // GET /best-products → ambil produk unggulan untuk halaman Home
  getBestProducts: () =>
    apiClient.get<Product[]>('/best-products').then((r) => r.data),

  // GET /products → semua produk (dengan opsional filter pencarian)
  // GET /products?q=bakso → json-server otomatis filter berdasarkan query
  getAll: (query?: string) => {
    const params = query ? { q: query } : {}
    return apiClient.get<Product[]>('/products', { params }).then((r) => r.data)
  },

  // GET /products/:id → satu produk berdasarkan ID
  getById: (id: number) =>
    apiClient.get<Product>(`/products/${id}`).then((r) => r.data),
}

// ─────────────────────────────────────────────────
// CART API
// ─────────────────────────────────────────────────

export const cartApi = {
  // GET /keranjangs → semua item di keranjang
  getAll: () =>
    apiClient.get<CartItem[]>('/keranjangs').then((r) => r.data),

  // POST /keranjangs → tambah item ke keranjang
  add: (payload: AddToCartPayload) =>
    apiClient.post<CartItem>('/keranjangs', payload).then((r) => r.data),

  // DELETE /keranjangs/:id → hapus item dari keranjang
  remove: (id: number) =>
    apiClient.delete(`/keranjangs/${id}`).then((r) => r.data),
}

// ─────────────────────────────────────────────────
// ORDER API
// ─────────────────────────────────────────────────

export const orderApi = {
  // POST /pesanans → buat pesanan baru (checkout)
  create: (payload: OrderPayload) =>
    apiClient.post('/pesanans', payload).then((r) => r.data),
}
```

---

## Cara Pakai di Store

```ts
import { foodApi, cartApi } from '@/api/endpoints'

// Ambil semua produk
const products = await foodApi.getAll()

// Cari produk
const results = await foodApi.getAll('bakso')

// Ambil satu produk
const product = await foodApi.getById(1)

// Tambah ke keranjang
await cartApi.add({
  jumlah_pemesanan: 2,
  keterangan: 'pedes',
  products: product
})
```

---

## Pola `.then((r) => r.data)`

Axios mengembalikan response object dengan struktur:
```ts
{
  data: T,          // data aktual
  status: number,
  headers: {...},
  // ...
}
```

Dengan `.then((r) => r.data)`, fungsi langsung mengembalikan data tanpa wrapper, sehingga lebih bersih dipakai:

```ts
// Tanpa .then((r) => r.data):
const response = await apiClient.get('/products')
const products = response.data   // harus akses .data

// Dengan .then((r) => r.data):
const products = await foodApi.getAll()  // langsung dapat array
```

---

## Generics pada Axios

```ts
apiClient.get<Product[]>('/products')
//               ↑
//        TypeScript tahu bahwa r.data bertipe Product[]
```

Ini membuat TypeScript bisa validasi tipe data response sehingga error tertangkap saat development, bukan saat runtime.
