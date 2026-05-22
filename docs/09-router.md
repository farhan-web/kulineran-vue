# 09 — Vue Router

**File:** `src/router/index.ts`

---

## Kode Lengkap

```ts
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,           // import langsung (tidak lazy)
    },
    {
      path: '/foods',
      name: 'foods',
      component: () => import('@/views/FoodsView.vue'),           // lazy load
    },
    {
      path: '/foods/:id',
      name: 'food-detail',
      component: () => import('@/views/FoodDetailView.vue'),      // lazy load
    },
    {
      path: '/keranjang',
      name: 'cart',
      component: () => import('@/views/CartView.vue'),            // lazy load
    },
    {
      path: '/pesanan-sukses',
      name: 'order-success',
      component: () => import('@/views/OrderSuccessView.vue'),    // lazy load
    },
  ],
  scrollBehavior() {
    return { top: 0 }    // scroll ke atas saat pindah halaman
  },
})

export default router
```

---

## Daftar Routes

| Path | Name | Component | Deskripsi |
|------|------|-----------|-----------|
| `/` | `home` | HomeView | Halaman utama + produk unggulan |
| `/foods` | `foods` | FoodsView | Daftar semua makanan + pencarian |
| `/foods/:id` | `food-detail` | FoodDetailView | Detail produk + form pesan |
| `/keranjang` | `cart` | CartView | Keranjang + checkout |
| `/pesanan-sukses` | `order-success` | OrderSuccessView | Konfirmasi pesanan berhasil |

---

## `createWebHistory` vs `createWebHashHistory`

```ts
// Web History (yang dipakai) — URL bersih
history: createWebHistory()
// Contoh URL: http://localhost:5050/foods/3

// Hash History — URL pakai #
history: createWebHashHistory()
// Contoh URL: http://localhost:5050/#/foods/3
```

Web History lebih baik untuk SEO dan UX, tapi butuh konfigurasi server agar semua request di-redirect ke `index.html` (untuk production deployment).

---

## Lazy Loading Routes

```ts
// Eager loading — FoodsView dimuat saat app pertama kali buka
component: FoodsView

// Lazy loading — FoodsView dimuat hanya saat user navigasi ke /foods
component: () => import('@/views/FoodsView.vue')
```

HomeView di-load eager karena halaman pertama yang dilihat user. Halaman lain di-lazy load untuk mempercepat initial load.

---

## Dynamic Route Parameter

```ts
{ path: '/foods/:id', name: 'food-detail', component: ... }
```

`:id` adalah parameter dinamis. Di dalam komponen, diakses via:

```ts
import { useRoute } from 'vue-router'

const route = useRoute()
const id = Number(route.params.id)   // → misal: 3
```

---

## Navigasi Programatik

```ts
import { useRouter } from 'vue-router'

const router = useRouter()

// Push — tambah ke history (bisa back)
router.push('/keranjang')
router.push({ name: 'cart' })

// Replace — ganti current history (tidak bisa back)
router.replace('/pesanan-sukses')
```

---

## `scrollBehavior`

```ts
scrollBehavior() {
  return { top: 0 }
}
```

Tanpa ini, saat pindah halaman, scroll position tidak berubah. Dengan ini, setiap navigasi akan scroll ke atas halaman otomatis.

---

## Registrasi di main.ts

```ts
import router from './router'

app.use(router)
```

Setelah `use(router)`, komponen bisa pakai `<RouterLink>`, `<RouterView>`, `useRoute()`, dan `useRouter()`.
