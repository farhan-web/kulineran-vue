# Dokumentasi Kulineran

Dokumentasi lengkap project **Kulineran** — aplikasi pemesanan makanan berbasis web yang dibangun dengan Vue 3, TypeScript, Pinia, dan shadcn-vue.

## Daftar Isi

| No | Dokumen | Isi |
|----|---------|-----|
| 01 | [Setup Project](./01-setup.md) | Cara setup project dari awal |
| 02 | [Struktur Folder](./02-struktur-folder.md) | Penjelasan tiap folder dan file |
| 03 | [Konfigurasi](./03-konfigurasi.md) | Semua file config (Vite, TS, Tailwind, dll) |
| 04 | [TypeScript Types](./04-types.md) | Interface dan tipe data yang digunakan |
| 05 | [API Layer](./05-api-layer.md) | Axios client dan endpoint functions |
| 06 | [Pinia Stores](./06-pinia-stores.md) | State management dengan Pinia |
| 07 | [shadcn-vue Components](./07-shadcn-components.md) | UI primitives dari shadcn-vue |
| 08 | [Layout & Shared Components](./08-layout-components.md) | Navbar, Footer, FoodCard, Breadcrumb |
| 09 | [Vue Router](./09-router.md) | Setup routing dan navigasi |
| 10 | [Mock API (json-server)](./10-mock-api.md) | Backend palsu untuk development |
| 11 | [Views / Halaman](./11-views.md) | Implementasi semua halaman |
| 12 | [Cara Menjalankan](./12-menjalankan.md) | Perintah dev, build, preview |

---

## Stack Teknologi

| Layer | Teknologi | Fungsi |
|-------|-----------|--------|
| Framework | **Vue 3** | UI framework |
| Bahasa | **TypeScript** | Type safety |
| Build Tool | **Vite** | Bundler & dev server |
| State | **Pinia** | Global state management |
| Routing | **Vue Router 4** | Client-side routing |
| Styling | **Tailwind CSS** | Utility-first CSS |
| UI Components | **shadcn-vue** | Komponen UI berbasis reka-ui |
| Icons | **@lucide/vue** | Icon library |
| HTTP | **Axios** | HTTP client |
| Notifications | **vue-sonner** | Toast notifications |
| Utilities | **@vueuse/core** | Vue composition utilities |
| Mock API | **json-server** | REST API palsu untuk dev |

---

## Alur Aplikasi

```
User buka /              → HomeView   → fetch best-products
User buka /foods         → FoodsView  → fetch products (+ search)
User klik produk         → FoodDetailView → fetch product by id → add to cart
User buka /keranjang     → CartView   → fetch cart → checkout
Checkout sukses          → OrderSuccessView
```

---

## URL Aplikasi (Development)

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5050 |
| Backend (json-server) | http://localhost:5051 |
