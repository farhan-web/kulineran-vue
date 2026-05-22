# Setup Manual — Project Kulineran (Vue 3 + Vite + Tailwind + shadcn-vue)

Dokumen ini berisi **semua langkah setup dari nol** beserta **full code** setiap file yang perlu dibuat atau diubah secara manual.

---

## Prasyarat

Pastikan sudah terinstall:
- **Node.js** v18+
- **npm** v9+

```bash
node -v   # cek versi Node
npm -v    # cek versi npm
```

---

## Ringkasan File yang Perlu Dibuat/Diubah Manual

| File | Status | Keterangan |
|---|---|---|
| `vite.config.ts` | Edit | Tambah alias `@` dan port |
| `index.html` | Edit | Tambah Google Fonts Montserrat |
| `tailwind.config.js` | Buat | Konfigurasi Tailwind + shadcn |
| `postcss.config.js` | Buat | Aktifkan Tailwind di PostCSS |
| `src/assets/main.css` | Edit | Tailwind directives + CSS variables |
| `src/main.ts` | Edit | Pasang Pinia + Router |
| `src/App.vue` | Edit | Layout utama (Navbar, RouterView, Footer) |
| `src/router/index.ts` | Buat | Definisi semua routes |
| `src/lib/utils.ts` | Buat | Helper `cn()` untuk merge class |
| `src/types/index.ts` | Buat | Semua TypeScript interfaces |
| `src/api/client.ts` | Buat | Instance Axios |
| `src/api/endpoints.ts` | Buat | Semua fungsi API call |
| `src/stores/foodStore.ts` | Buat | Pinia store untuk produk |
| `src/stores/cartStore.ts` | Buat | Pinia store untuk keranjang |
| `db.json` | Buat | Data mock untuk json-server |
| `.env` | Buat | URL API untuk Vite |

---

## Step 1 — Buat Project Vite + Vue 3 + TypeScript

```bash
npm create vite@latest kulineran -- --template vue-ts
cd kulineran
npm install
```

Ini akan generate struktur dasar project. Setelah ini semua langkah di bawah dikerjakan manual.

---

## Step 2 — Install Semua Dependensi

Jalankan satu per satu atau sekaligus:

```bash
# State management & routing & HTTP
npm install pinia vue-router@4 axios

# shadcn-vue ecosystem (UI primitives)
npm install reka-ui class-variance-authority clsx tailwind-merge tailwindcss-animate

# Utilities tambahan
npm install @vueuse/core @lucide/vue vue-sonner

# Tailwind CSS (dev dependency)
npm install -D tailwindcss postcss autoprefixer

# Mock API server (dev dependency)
npm install -D json-server
```

---

## Step 3 — Edit `vite.config.ts`

**Apa yang ditambah:** alias `@` agar import bisa pakai `@/...` dan custom port dev server.

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5050,           // dev server jalan di port ini
  },
  resolve: {
    alias: {
      // '@' = shortcut ke folder src/
      // contoh: '@/components/Navbar.vue' = 'src/components/Navbar.vue'
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
```

---

## Step 4 — Edit `index.html`

**Apa yang ditambah:** Google Fonts Montserrat dan judul halaman.

```html
<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Kulineran - Pesan Makanan Favoritmu</title>

    <!-- Preconnect mempercepat load Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

    <!-- Font Montserrat: weight 400 (regular), 500 (medium), 600 (semibold), 700 (bold) -->
    <link
      href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

---

## Step 5 — Buat `tailwind.config.js`

**Buat file baru** di root project. File ini konfigurasi Tailwind sekaligus setup warna shadcn-vue.

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from 'tailwindcss-animate'

export default {
  // Dark mode diaktifkan via class="dark" di elemen HTML
  darkMode: ['class'],

  // Tailwind scan file-file ini untuk generate hanya class yang dipakai
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],

  theme: {
    // Konfigurasi container (div dengan class="container")
    container: {
      center: true,       // otomatis margin auto (centered)
      padding: '2rem',    // padding kiri-kanan 32px
      screens: {
        '2xl': '1400px',  // max-width container di layar 2xl
      },
    },
    extend: {
      // Font utama project: Montserrat (diload dari Google Fonts di index.html)
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },

      // Semua warna membaca dari CSS variables di main.css
      // Format: hsl(var(--nama-variable))
      // Untuk ganti warna → edit :root di main.css, bukan di sini
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },

      // Border radius juga dari CSS variable agar konsisten
      borderRadius: {
        lg: 'var(--radius)',                  // 0.75rem
        md: 'calc(var(--radius) - 2px)',      // 0.625rem
        sm: 'calc(var(--radius) - 4px)',      // 0.5rem
      },

      // Keyframe animasi untuk komponen Accordion (shadcn-vue)
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },

  // Plugin animasi tambahan dari shadcn-vue (fade, slide, zoom, dll)
  plugins: [tailwindcssAnimate],
}
```

---

## Step 6 — Buat `postcss.config.js`

**Buat file baru** di root project. PostCSS memproses CSS sebelum ke browser.

```js
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},    // generate semua utility class Tailwind
    autoprefixer: {},   // tambah prefix vendor (-webkit-, dll) otomatis
  },
}
```

---

## Step 7 — Edit `src/assets/main.css`

**Hapus isi lama** (bawaan Vite), ganti dengan ini. File ini mendefinisikan Tailwind dan semua CSS variables warna.

```css
/* src/assets/main.css */

/* Tailwind directives — wajib ada, urutan ini penting */
@tailwind base;        /* reset CSS dasar */
@tailwind components;  /* class komponen */
@tailwind utilities;   /* semua utility class (flex, p-4, text-sm, dll) */

/* ── CSS Variables Light Mode ─────────────────────────────── */
/* Nilai format: H S% L% (Hue Saturation% Lightness%)         */
/* Dipakai oleh tailwind.config.js via hsl(var(--nama))       */
/* Untuk ganti warna tema → ubah nilai di sini                */
@layer base {
  :root {
    --background: 0 0% 100%;            /* putih */
    --foreground: 222.2 84% 4.9%;       /* hampir hitam */
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 152 55% 48%;             /* hijau — warna utama brand */
    --primary-foreground: 210 40% 98%;  /* teks di atas primary */
    --secondary: 210 40% 96.1%;         /* abu muda */
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;       /* merah — untuk hapus/error */
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;        /* warna garis border */
    --input: 214.3 31.8% 91.4%;         /* warna border input field */
    --ring: 152 55% 48%;                /* warna focus ring = sama dengan primary */
    --radius: 0.75rem;                  /* border radius global */
  }

  /* ── CSS Variables Dark Mode ───────────────────────────── */
  /* Aktif saat elemen HTML punya class="dark"               */
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 152 55% 48%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 152 55% 48%;
  }
}

/* ── Global Base Styles ───────────────────────────────────── */
@layer base {
  * {
    /* Semua elemen pakai border-border secara default */
    @apply border-border;
  }
  body {
    /* Background, teks, dan font default dari CSS variables di atas */
    @apply bg-background text-foreground font-sans;
  }
}
```

---

## Step 8 — Edit `src/main.ts`

**Daftarkan Pinia dan Router** ke aplikasi Vue.

```ts
// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'   // state management
import App from './App.vue'
import router from './router'          // vue-router
import './assets/main.css'             // Tailwind + CSS variables

const app = createApp(App)

app.use(createPinia())  // pasang Pinia — harus sebelum mount
app.use(router)         // pasang Router — harus sebelum mount

app.mount('#app')       // render aplikasi ke <div id="app"> di index.html
```

---

## Step 9 — Edit `src/App.vue`

**Layout utama** yang membungkus semua halaman. Navbar dan Footer tampil di semua halaman.

```vue
<!-- src/App.vue -->
<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Toaster } from 'vue-sonner'           // komponen notifikasi toast
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'
</script>

<template>
  <!-- min-h-screen flex flex-col: layout stretches full height -->
  <div class="min-h-screen flex flex-col">
    <!-- Navbar selalu tampil di atas -->
    <Navbar />

    <!-- flex-1: area konten mengisi sisa ruang vertikal -->
    <div class="flex-1">
      <!-- RouterView: render komponen view sesuai route aktif -->
      <RouterView />
    </div>

    <!-- Footer selalu tampil di bawah -->
    <Footer />

    <!-- Toaster: container untuk notifikasi toast (vue-sonner) -->
    <!-- position="top-right": muncul di pojok kanan atas -->
    <!-- rich-colors: warna berbeda untuk success/error/warning -->
    <Toaster position="top-right" rich-colors />
  </div>
</template>
```

---

## Step 10 — Buat `src/router/index.ts`

**Buat folder `src/router/`** lalu buat file ini. Definisi semua halaman dan URL-nya.

```ts
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  // createWebHistory: URL bersih tanpa # (contoh: /foods bukan /#/foods)
  // BASE_URL dari Vite, biasanya '/'
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'home',
      // HomeView di-import langsung (eager) karena halaman pertama yang dibuka
      component: HomeView,
    },
    {
      path: '/foods',
      name: 'foods',
      // Lazy load: komponen hanya didownload saat user buka halaman ini
      component: () => import('@/views/FoodsView.vue'),
    },
    {
      path: '/foods/:id',    // :id = parameter dinamis, contoh: /foods/3
      name: 'food-detail',
      component: () => import('@/views/FoodDetailView.vue'),
    },
    {
      path: '/keranjang',
      name: 'cart',
      component: () => import('@/views/CartView.vue'),
    },
    {
      path: '/pesanan-sukses',
      name: 'order-success',
      component: () => import('@/views/OrderSuccessView.vue'),
    },
  ],

  // Setiap navigasi ke halaman baru, scroll ke atas
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
```

---

## Step 11 — Buat `src/lib/utils.ts`

**Buat folder `src/lib/`** lalu buat file ini. Helper wajib untuk shadcn-vue.

```ts
// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Menggabungkan class Tailwind dengan aman, tanpa konflik.
 *
 * Masalah yang diselesaikan:
 *   cn('px-4', 'px-2')  → 'px-2'  (bukan 'px-4 px-2' yang konflik)
 *   cn('p-4', condition && 'p-2')  → handle conditional class
 *
 * Dipakai di semua komponen shadcn-vue dan di mana saja yang butuh
 * menggabungkan class secara dinamis.
 *
 * @param inputs - class string, array, object, atau kondisional
 * @returns string class yang sudah digabung dan dioptimasi
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## Step 12 — Buat `src/types/index.ts`

**Buat folder `src/types/`** lalu buat file ini. Semua interface TypeScript dikumpulkan di sini.

```ts
// src/types/index.ts

/** Data satu produk makanan dari API */
export interface Product {
  id: number
  nama: string
  harga: number           // dalam rupiah
  gambar: string          // nama file, contoh: "nasi-goreng.jpg"
  deskripsi?: string      // opsional
  kategori?: string       // opsional
}

/** Satu item di dalam keranjang belanja */
export interface CartItem {
  id: number              // ID record keranjang (bukan ID produk)
  jumlah_pemesanan: number
  keterangan: string      // catatan tambahan, misal "pedes"
  products: Product       // data produk lengkap (nested)
}

/** Data yang dikirim ke API saat checkout */
export interface OrderPayload {
  nama: string            // nama pelanggan
  noMeja: string          // nomor meja
  keranjangs: CartItem[]  // semua item keranjang
}

/** Data yang dikirim ke API saat tambah ke keranjang */
export interface AddToCartPayload {
  jumlah_pemesanan: number
  keterangan: string
  products: Product
}
```

---

## Step 13 — Buat `src/api/client.ts`

**Buat folder `src/api/`** lalu buat file ini.

```ts
// src/api/client.ts
import axios from 'axios'

/**
 * Instance Axios dengan konfigurasi default.
 * Semua request HTTP menggunakan instance ini, bukan axios langsung.
 */
const apiClient = axios.create({
  // Baca dari .env (VITE_API_URL), fallback ke localhost:3000
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default apiClient
```

---

## Step 14 — Buat `src/api/endpoints.ts`

```ts
// src/api/endpoints.ts
import type { AddToCartPayload, CartItem, OrderPayload, Product } from '@/types'
import apiClient from './client'

// ── FOOD API ──────────────────────────────────────────────
export const foodApi = {
  // GET /best-products
  getBestProducts: () =>
    apiClient.get<Product[]>('/best-products').then((r) => r.data),

  // GET /products atau GET /products?q=keyword
  getAll: (query?: string) => {
    const params = query ? { q: query } : {}
    return apiClient.get<Product[]>('/products', { params }).then((r) => r.data)
  },

  // GET /products/:id
  getById: (id: number) =>
    apiClient.get<Product>(`/products/${id}`).then((r) => r.data),
}

// ── CART API ──────────────────────────────────────────────
export const cartApi = {
  // GET /keranjangs
  getAll: () =>
    apiClient.get<CartItem[]>('/keranjangs').then((r) => r.data),

  // POST /keranjangs
  add: (payload: AddToCartPayload) =>
    apiClient.post<CartItem>('/keranjangs', payload).then((r) => r.data),

  // DELETE /keranjangs/:id
  remove: (id: number) =>
    apiClient.delete(`/keranjangs/${id}`).then((r) => r.data),
}

// ── ORDER API ─────────────────────────────────────────────
export const orderApi = {
  // POST /pesanans
  create: (payload: OrderPayload) =>
    apiClient.post('/pesanans', payload).then((r) => r.data),
}
```

---

## Step 15 — Buat `src/stores/foodStore.ts`

**Buat folder `src/stores/`** lalu buat file ini.

```ts
// src/stores/foodStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from '@/types'
import { foodApi } from '@/api/endpoints'

export const useFoodStore = defineStore('food', () => {
  // STATE
  const products = ref<Product[]>([])
  const bestProducts = ref<Product[]>([])
  const currentProduct = ref<Product | null>(null)
  const isLoading = ref(false)
  const searchQuery = ref('')

  // ACTIONS
  async function fetchBestProducts() {
    isLoading.value = true
    try {
      bestProducts.value = await foodApi.getBestProducts()
    } finally {
      isLoading.value = false   // finally: selalu jalan meski error
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

  return {
    products, bestProducts, currentProduct, isLoading, searchQuery,
    fetchBestProducts, fetchProducts, fetchProductById, setSearchQuery,
  }
})
```

---

## Step 16 — Buat `src/stores/cartStore.ts`

```ts
// src/stores/cartStore.ts
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { CartItem, Product } from '@/types'
import { cartApi, orderApi } from '@/api/endpoints'

export const useCartStore = defineStore('cart', () => {
  // STATE
  const items = ref<CartItem[]>([])
  const isLoading = ref(false)

  // GETTERS
  const totalItems = computed(() => items.value.length)
  const totalPrice = computed(() =>
    items.value.reduce(
      (sum, item) => sum + item.products.harga * item.jumlah_pemesanan,
      0,
    ),
  )

  // ACTIONS
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
    await fetchCart()   // refresh setelah tambah
  }

  async function removeFromCart(id: number) {
    await cartApi.remove(id)
    await fetchCart()   // refresh setelah hapus
  }

  async function checkout(nama: string, noMeja: string) {
    // 1. Buat record pesanan
    await orderApi.create({ nama, noMeja, keranjangs: items.value })
    // 2. Hapus semua item keranjang secara paralel
    await Promise.all(items.value.map((item) => cartApi.remove(item.id)))
    // 3. Kosongkan state lokal
    items.value = []
  }

  // Format angka ke rupiah: 12000 → "12.000"
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

## Step 17 — Buat `db.json`

**Buat file di root project.** Ini adalah database mock untuk json-server.

```json
{
  "best-products": [
    { "id": 1, "nama": "Nasi Goreng Telur", "harga": 12000, "gambar": "nasi-goreng-telor.jpg" },
    { "id": 2, "nama": "Mie Goreng", "harga": 11000, "gambar": "mie-goreng.jpg" },
    { "id": 3, "nama": "Nasi Rames", "harga": 13000, "gambar": "nasi-rames.jpg" }
  ],
  "products": [
    { "id": 1, "nama": "Nasi Goreng Telur", "harga": 12000, "gambar": "nasi-goreng-telor.jpg", "deskripsi": "Nasi goreng dengan telur ceplok yang lezat." },
    { "id": 2, "nama": "Mie Goreng", "harga": 11000, "gambar": "mie-goreng.jpg", "deskripsi": "Mie goreng dengan bumbu khas." },
    { "id": 3, "nama": "Nasi Rames", "harga": 13000, "gambar": "nasi-rames.jpg", "deskripsi": "Nasi dengan lauk pilihan." }
  ],
  "keranjangs": [],
  "pesanans": []
}
```

> **Tips:** `keranjangs` dan `pesanans` diawali kosong `[]`. json-server otomatis isi saat ada POST request.

---

## Step 18 — Buat `.env`

**Buat file di root project.** URL API yang dibaca oleh `src/api/client.ts`.

```
VITE_API_URL=http://localhost:5051
```

> **Wajib:** Semua env variable di Vite harus diawali `VITE_` agar bisa diakses dari kode frontend via `import.meta.env.VITE_API_URL`.

---

## Step 19 — Update `package.json` Scripts

Tambahkan script `dev:api` ke `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "dev:api": "json-server --watch db.json --port 5051",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .vue,.ts,.tsx --fix"
  }
}
```

---

## Menjalankan Project

Butuh **2 terminal** yang jalan bersamaan:

**Terminal 1 — Frontend (Vite):**
```bash
npm run dev
# → http://localhost:5050
```

**Terminal 2 — Mock API (json-server):**
```bash
npm run dev:api
# → http://localhost:5051
```

---

## Checklist Urutan Setup

```
[ ] Step 1  — npm create vite + npm install
[ ] Step 2  — install semua dependensi
[ ] Step 3  — edit vite.config.ts (alias + port)
[ ] Step 4  — edit index.html (Google Fonts)
[ ] Step 5  — buat tailwind.config.js
[ ] Step 6  — buat postcss.config.js
[ ] Step 7  — edit src/assets/main.css (Tailwind + CSS variables)
[ ] Step 8  — edit src/main.ts (Pinia + Router)
[ ] Step 9  — edit src/App.vue (layout utama)
[ ] Step 10 — buat src/router/index.ts
[ ] Step 11 — buat src/lib/utils.ts
[ ] Step 12 — buat src/types/index.ts
[ ] Step 13 — buat src/api/client.ts
[ ] Step 14 — buat src/api/endpoints.ts
[ ] Step 15 — buat src/stores/foodStore.ts
[ ] Step 16 — buat src/stores/cartStore.ts
[ ] Step 17 — buat db.json
[ ] Step 18 — buat .env
[ ] Step 19 — update package.json scripts
[ ]          — buat views dan components (lihat docs lain)
```
