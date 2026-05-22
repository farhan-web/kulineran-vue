# Panduan Belajar Full Stack Vue 3 + Spring Boot

Dokumen ini berisi tahapan belajar dan urutan pengerjaan project full stack dari nol sampai selesai. Cocok dijadikan standar pribadi saat test atau interview.

---

## Mindset Sebelum Mulai

- Jangan langsung coding — pahami dulu apa yang diminta
- Baca requirement, identifikasi entity (tabel/data apa saja yang ada)
- Gambar mental flow aplikasinya: user bisa ngapain saja
- Pisahkan mana yang backend urusin, mana yang frontend urusin

---

## Fase 0 — Analisis & Perencanaan (sebelum buka VS Code)

1. Baca soal/requirement sampai habis
2. Identifikasi **entity** — contoh: Product, User, Order, Cart
3. Tentukan **relasi** antar entity — contoh: User punya banyak Order
4. List semua **endpoint API** yang dibutuhkan — method, URL, butuh auth atau tidak
5. List semua **halaman** yang perlu dibuat
6. Tentukan halaman mana yang **public** dan mana yang **protected** (butuh login)

---

## Fase 1 — Setup Backend (Spring Boot)

Kerjakan backend dulu supaya API sudah siap saat frontend dibangun.

### 1.1 Buat Project

- Gunakan Spring Initializr (start.spring.io)
- Dependencies yang biasa dipakai: Spring Web, Spring Data JPA, Spring Security, Lombok, driver database (H2 untuk dev, MySQL/PostgreSQL untuk prod)

### 1.2 Konfigurasi Database

- Atur `application.properties` — URL database, username, password
- Aktifkan `ddl-auto: update` dulu saat development agar tabel otomatis terbuat

### 1.3 Buat Layer secara Urut (per Entity)

Urutan per entity: **Entity → Repository → DTO → Service → Controller**

- **Entity** — class yang merepresentasikan tabel database, pasang anotasi JPA
- **Repository** — interface extends JpaRepository, tulis query custom jika perlu
- **DTO** — Request (data masuk dari frontend) dan Response (data keluar ke frontend), jangan expose entity langsung
- **Service** — logika bisnis, validasi, manipulasi data
- **Controller** — terima request HTTP, panggil service, kembalikan response

### 1.4 Setup Security (JWT)

- Buat `JwtUtil` — generate dan validasi token
- Buat `JwtAuthenticationFilter` — intersep setiap request dan validasi token
- Buat `SecurityConfig` — atur endpoint mana yang public, mana yang butuh auth, setup CORS

### 1.5 Konfigurasi CORS

- Daftarkan origin frontend (localhost dengan port Vite) di SecurityConfig
- Pastikan method GET, POST, PUT, DELETE, OPTIONS diizinkan

### 1.6 Test API

- Test semua endpoint menggunakan Postman atau Insomnia sebelum lanjut ke frontend
- Pastikan register, login, dan endpoint yang butuh token berjalan benar

---

## Fase 2 — Setup Frontend (Vue 3 + Vite)

### 2.1 Buat Project

- `npm create vite@latest nama-project -- --template vue-ts`
- Install dependensi: pinia, vue-router, axios, tailwindcss, shadcn-vue ecosystem

### 2.2 Konfigurasi File Awal

Urutan konfigurasi yang benar:

1. **`vite.config.ts`** — tambah alias `@` ke folder src dan set port dev server
2. **`tailwind.config.js`** — setup content paths, warna dari CSS variables, font, plugin animasi
3. **`postcss.config.js`** — aktifkan tailwindcss dan autoprefixer
4. **`src/assets/main.css`** — tulis Tailwind directives dan CSS variables warna di `:root`
5. **`index.html`** — load Google Fonts jika pakai custom font, ubah title
6. **`src/lib/utils.ts`** — buat fungsi `cn()` untuk merge class Tailwind
7. **`.env`** — isi `VITE_API_URL` dengan URL backend

### 2.3 Atur Struktur Folder

Buat folder-folder ini di dalam `src/` sebelum mulai coding:

```
src/
├── api/          ← semua request HTTP
├── assets/       ← CSS, gambar
├── components/
│   ├── common/   ← komponen reusable (Breadcrumb, dll)
│   ├── layout/   ← Navbar, Footer
│   └── ui/       ← shadcn-vue components
├── lib/          ← utils
├── router/       ← definisi routes
├── stores/       ← Pinia stores
├── types/        ← TypeScript interfaces
└── views/        ← satu file per halaman
```

---

## Fase 3 — Bangun Frontend Layer per Layer

Ini urutan yang paling efisien — dari bawah ke atas.

### Step 1 — Types (`src/types/index.ts`)

Tulis semua interface TypeScript dulu. Ini jadi kontrak antara frontend dan backend. Sesuaikan field dengan response DTO dari backend. Kerjakan ini pertama karena semua layer lain bergantung pada types.

### Step 2 — API Layer (`src/api/`)

- Buat `client.ts` — instance Axios dengan baseURL dari `.env` dan header default
- Pasang JWT interceptor — sisipkan token dari localStorage ke setiap request secara otomatis
- Pasang response interceptor — tangkap 401, hapus token, redirect ke login
- Buat `endpoints.ts` — tulis semua fungsi API call, kelompokkan per resource (foodApi, cartApi, authApi, dll)

### Step 3 — Stores (`src/stores/`)

- Buat store per fitur: `authStore`, `foodStore`, `cartStore`, dst
- Tiap store punya: state (ref), getter (computed), action (async function)
- `authStore` — kelola token, user, login, register, logout. Simpan token ke localStorage
- Store lain — fetch data dari API, simpan ke state, expose ke komponen

### Step 4 — Router (`src/router/index.ts`)

- Daftarkan semua routes dengan lazy loading (kecuali home)
- Tentukan route mana yang protected di array `authRequired`
- Pasang navigation guard `beforeEach` — cek token, redirect ke login jika belum login, redirect ke home jika sudah login tapi akses halaman auth
- Sertakan query `redirect` saat redirect ke login agar bisa balik ke halaman asal

### Step 5 — Layout Utama (`src/App.vue` dan `src/main.ts`)

- `main.ts` — daftarkan Pinia dan Router ke app Vue
- `App.vue` — susun layout global: Navbar di atas, RouterView di tengah, Footer di bawah, Toaster untuk notifikasi

### Step 6 — Komponen UI (`src/components/`)

Bangun dari yang paling general ke yang paling spesifik:

- **Navbar** — logo, navigasi, badge keranjang, tombol login/logout berdasarkan state auth
- **Footer** — informasi sederhana
- **Komponen reusable** — Breadcrumb, card produk, skeleton loading, dll

Untuk styling komponen, gunakan class Tailwind. Ukuran font heading biasanya `text-2xl` atau `text-3xl`, body `text-sm` atau `text-base`. Padding card biasanya `p-4` atau `p-6`. Gap antar elemen `gap-4`. Gunakan CSS variables yang sudah didefinisikan di `main.css` melalui class seperti `text-primary`, `bg-muted`, `text-muted-foreground`.

### Step 7 — Views (Halaman)

Kerjakan halaman satu per satu, mulai dari yang paling simple:

1. **LoginView** dan **RegisterView** — form sederhana, tidak butuh data dari store lain
2. **HomeView** — tampilkan produk unggulan, fetch dari store saat mounted
3. **FoodsView** — list semua produk, fitur search
4. **FoodDetailView** — detail produk, form tambah ke keranjang, cek login sebelum submit
5. **CartView** — list keranjang, total harga, form checkout
6. **OrderSuccessView** — halaman konfirmasi setelah checkout berhasil

---

## Fase 4 — Validasi & UX

Setelah semua halaman jalan, tambahkan:

- **Loading state** — tampilkan spinner atau skeleton saat fetch data
- **Error handling** — toast error jika request gagal
- **Form validation** — cek field kosong, password match, minimal panjang karakter
- **Empty state** — tampilkan pesan jika data kosong (keranjang kosong, produk tidak ditemukan)
- **Disabled state** — disable tombol submit saat loading atau form belum valid

---

## Fase 5 — Integrasi & Testing

- Pastikan semua endpoint sudah terhubung ke backend yang berjalan
- Test flow lengkap: register → login → browse produk → tambah keranjang → checkout
- Test edge case: akses halaman protected tanpa login, token expired, data kosong
- Pastikan redirect setelah login membawa user ke halaman yang dituju sebelumnya

---

## Urutan Pengerjaan Ringkas

```
Analisis soal
  → Buat backend (Entity → Repo → DTO → Service → Controller → Security)
  → Test API dengan Postman
  → Setup frontend (vite, tailwind, env, struktur folder)
  → Types → API Layer → Stores → Router → App.vue → Components → Views
  → Validasi UX (loading, error, empty state)
  → Test flow end-to-end
```

---

## Tips saat Test/Interview

- Mulai dari yang pasti dulu — setup dan struktur folder yang rapi menunjukkan pemahaman arsitektur
- Jangan skip types — ini bukti kamu paham kontrak data antara FE dan BE
- Kerjakan fitur auth lebih awal — banyak fitur lain bergantung padanya
- Gunakan toast untuk semua feedback ke user, bukan `alert()`
- Commit per fitur jika ada git — jangan satu commit untuk semua
- Kalau stuck di satu bagian, skip dan kerjakan bagian lain dulu
