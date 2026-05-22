# 10 — Mock API (json-server)

json-server mengubah file `db.json` menjadi REST API yang bisa dipakai seperti API sungguhan — tanpa perlu bikin backend.

---

## Cara Kerja json-server

json-server membaca `db.json` dan otomatis membuat endpoint REST berdasarkan key di dalamnya:

```json
{
  "products": [...],      → GET /products, GET /products/:id, POST /products, dll
  "keranjangs": [...],    → GET /keranjangs, POST /keranjangs, DELETE /keranjangs/:id
  "pesanans": [...],      → GET /pesanans, POST /pesanans
  "best-products": [...]  → GET /best-products
}
```

---

## Struktur db.json

```json
{
  "best-products": [
    { "id": 1, "nama": "Nasi Goreng Telur", "harga": 12000, "gambar": "nasi-goreng-telor.jpg" },
    { "id": 2, "nama": "Mie Goreng",        "harga": 11000, "gambar": "mie-goreng.jpg" },
    { "id": 3, "nama": "Nasi Rames",        "harga": 13000, "gambar": "nasi-rames.jpg" }
  ],

  "products": [
    {
      "id": 1,
      "nama": "Nasi Goreng Telur",
      "harga": 12000,
      "gambar": "nasi-goreng-telor.jpg",
      "deskripsi": "Nasi goreng dengan telur ceplok yang lezat dan gurih."
    },
    // ... 9 produk lainnya
  ],

  "keranjangs": [],    // awalnya kosong, diisi saat user pesan

  "pesanans": []       // awalnya kosong, diisi saat checkout
}
```

---

## Endpoint yang Tersedia

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/best-products` | Ambil produk unggulan |
| GET | `/products` | Ambil semua produk |
| GET | `/products?q=bakso` | Cari produk (full-text search) |
| GET | `/products/:id` | Ambil satu produk |
| GET | `/keranjangs` | Ambil semua item keranjang |
| POST | `/keranjangs` | Tambah item ke keranjang |
| DELETE | `/keranjangs/:id` | Hapus item dari keranjang |
| POST | `/pesanans` | Buat pesanan baru |

---

## Fitur Pencarian Bawaan

json-server punya fitur full-text search via query param `?q=`:

```
GET /products?q=bakso
```

json-server akan cari kata "bakso" di semua field produk (nama, deskripsi, dll) dan return yang cocok. Ini yang dipakai di halaman Foods untuk fitur search.

---

## Menjalankan json-server

```bash
npm run dev:api
```

Atau manual:
```bash
json-server --watch db.json --port 5051
```

Output yang muncul:
```
Resources
http://localhost:5051/best-products
http://localhost:5051/products
http://localhost:5051/keranjangs
http://localhost:5051/pesanans

Watching...
```

---

## Data Persisten

json-server **menyimpan perubahan ke db.json**. Artinya:
- Kalau user tambah ke keranjang → `keranjangs` di `db.json` bertambah
- Kalau user checkout → `pesanans` di `db.json` bertambah, `keranjangs` dikosongkan

Ini berbeda dengan API palsu lain yang reset tiap restart.

---

## Reset Data

Kalau mau reset data keranjang dan pesanan ke kondisi awal:

```json
// Edit db.json, ubah kembali ke:
{
  "keranjangs": [],
  "pesanans": []
}
```

json-server akan detect perubahan file secara otomatis (`--watch`).
