# 02 — Struktur Folder

## Gambaran Umum

```
kulineran/
├── docs/                        # ← dokumentasi project ini
├── public/
│   └── assets/images/           # gambar produk (jpg/png)
├── src/
│   ├── api/                     # layer HTTP (axios)
│   │   ├── client.ts            # instance axios
│   │   └── endpoints.ts         # semua fungsi API call
│   ├── assets/
│   │   └── main.css             # Tailwind + CSS variables
│   ├── components/
│   │   ├── common/              # komponen reusable umum
│   │   │   └── Breadcrumb.vue
│   │   ├── food/                # komponen spesifik makanan
│   │   │   ├── FoodCard.vue
│   │   │   └── FoodCardSkeleton.vue
│   │   ├── layout/              # komponen layout global
│   │   │   ├── Navbar.vue
│   │   │   └── Footer.vue
│   │   └── ui/                  # shadcn-vue primitives
│   │       ├── badge/
│   │       ├── button/
│   │       ├── card/
│   │       ├── input/
│   │       ├── separator/
│   │       └── textarea/
│   ├── lib/
│   │   └── utils.ts             # fungsi cn() untuk merge class
│   ├── router/
│   │   └── index.ts             # definisi routes
│   ├── stores/                  # Pinia stores
│   │   ├── cartStore.ts         # state keranjang
│   │   └── foodStore.ts         # state produk makanan
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   ├── views/                   # halaman-halaman aplikasi
│   │   ├── HomeView.vue
│   │   ├── FoodsView.vue
│   │   ├── FoodDetailView.vue
│   │   ├── CartView.vue
│   │   └── OrderSuccessView.vue
│   ├── App.vue                  # root component
│   └── main.ts                  # entry point aplikasi
├── components.json              # konfigurasi shadcn-vue
├── db.json                      # data mock untuk json-server
├── env.d.ts                     # type declarations untuk env
├── index.html                   # HTML entry point
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## Penjelasan Tiap Folder

### `src/api/`
Semua kode yang berhubungan dengan HTTP request ke backend. Dipisah dari views/stores agar mudah diganti (misalnya ganti Axios ke Fetch API) tanpa ubah banyak file.

### `src/components/ui/`
Komponen primitif dari **shadcn-vue**. Ini adalah building blocks paling dasar seperti Button, Input, Card, dll. Komponen ini **tidak** mengandung logika bisnis, hanya styling dan struktur.

### `src/components/layout/`
Komponen yang muncul di semua halaman — Navbar dan Footer. Dipasang langsung di `App.vue` agar selalu tampil.

### `src/components/food/`
Komponen yang spesifik untuk fitur makanan — card untuk menampilkan produk, skeleton loading-nya, dll.

### `src/components/common/`
Komponen reusable yang bisa dipakai di mana saja, tidak terikat ke satu fitur. Contoh: Breadcrumb.

### `src/stores/`
State global menggunakan Pinia. Tiap store punya scope tersendiri:
- `foodStore` → data produk dan loading state
- `cartStore` → data keranjang, total harga, dan operasi checkout

### `src/types/`
Semua TypeScript interface dikumpulkan di satu tempat. Ini memudahkan konsistensi tipe data di seluruh aplikasi.

### `src/views/`
Satu file = satu halaman. Views menggunakan stores dan components untuk membangun UI halaman lengkap.

### `public/assets/images/`
Gambar statis yang diakses langsung oleh browser via URL `/assets/images/nama-file.jpg`. File di folder `public/` tidak diproses oleh Vite.

---

## Kenapa Struktur Ini?

Prinsip yang dipakai:

1. **Separation of Concerns** — API, state, UI, dan routing dipisah
2. **Feature-first di components** — komponen dikelompokkan berdasarkan fungsi (`food/`, `layout/`, `common/`)
3. **Single source of truth** — semua tipe di `types/`, semua API call di `api/`
4. **Scalable** — mudah tambah fitur baru tanpa mengacaukan yang sudah ada
