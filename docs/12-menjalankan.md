# 12 — Cara Menjalankan Project

---

## Development (Pertama Kali)

```bash
# 1. Clone atau masuk ke folder project
cd D:/data/com.kulineran

# 2. Install semua dependencies
npm install

# 3. Salin file environment
cp .env.example .env
# (atau buat manual file .env dengan isi: VITE_API_URL=http://localhost:5051)
```

---

## Menjalankan Aplikasi

Butuh **dua terminal** yang berjalan bersamaan:

**Terminal 1 — Backend (Mock API):**
```bash
npm run dev:api
```
Output:
```
Resources
http://localhost:5051/best-products
http://localhost:5051/products
http://localhost:5051/keranjangs
http://localhost:5051/pesanans

Watching...
```

**Terminal 2 — Frontend:**
```bash
npm run dev
```
Output:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5050/
```

Buka browser ke **http://localhost:5050**

---

## Semua Script yang Tersedia

| Script | Perintah | Fungsi |
|--------|----------|--------|
| `npm run dev` | `vite` | Jalankan dev server frontend (port 5050) |
| `npm run dev:api` | `json-server --watch db.json --port 5051` | Jalankan mock API |
| `npm run build` | `vue-tsc && vite build` | Type check lalu build production |
| `npm run preview` | `vite preview` | Preview hasil build production |
| `npm run lint` | `eslint . --fix` | Lint dan auto-fix kode |

---

## Build Production

```bash
npm run build
```

Vite akan:
1. Jalankan TypeScript type checking (`vue-tsc`)
2. Bundle semua file ke folder `dist/`
3. Optimize, minify, dan split kode otomatis

Output di `dist/`:
```
dist/
├── index.html
└── assets/
    ├── index-[hash].js      # kode utama
    ├── index-[hash].css     # stylesheet
    ├── FoodsView-[hash].js  # lazy loaded chunk
    └── ...
```

Preview hasil build:
```bash
npm run preview
# Buka http://localhost:4173
```

---

## Tambah Komponen shadcn-vue Baru

```bash
npx shadcn-vue@latest add [nama-komponen]
```

Contoh:
```bash
npx shadcn-vue@latest add dialog
npx shadcn-vue@latest add select
npx shadcn-vue@latest add table
npx shadcn-vue@latest add alert
```

Komponen baru akan otomatis dibuat di `src/components/ui/`.

---

## Reset Data Keranjang

Kalau mau reset data keranjang/pesanan di db.json:

Edit `db.json`, ubah:
```json
{
  "keranjangs": [],
  "pesanans": []
}
```

json-server otomatis reload.

---

## Troubleshooting

**Error: Port sudah dipakai**
```bash
# Cari proses yang pakai port 5050 atau 5051
netstat -ano | findstr :5050
# Kill prosesnya
taskkill /PID [nomor_pid] /F
```

**Error: Cannot find module '@/...'**
Pastikan tsconfig.json punya:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

**Error saat build: TypeScript error**
```bash
# Cek error TypeScript tanpa build
npx vue-tsc --noEmit
```

**Data tidak muncul di browser**
1. Pastikan `npm run dev:api` sudah jalan di terminal lain
2. Cek file `.env` ada dan isinya benar: `VITE_API_URL=http://localhost:5051`
3. Buka Network tab di DevTools browser, cek apakah request ke `localhost:5051` berhasil
