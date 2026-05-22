# 01 — Setup Project dari Awal

## Prasyarat

Pastikan sudah terinstall:
- **Node.js** v18 atau lebih baru
- **npm** v9 atau lebih baru

Cek versi:
```bash
node -v
npm -v
```

---

## 1. Buat Project Vite + Vue 3 + TypeScript

```bash
npm create vite@latest kulineran -- --template vue-ts
cd kulineran
```

Struktur awal yang dibuat Vite:
```
kulineran/
├── src/
│   ├── App.vue
│   ├── main.ts
│   └── ...
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 2. Install Semua Dependensi

```bash
npm install
```

Kemudian install dependensi tambahan yang dibutuhkan project:

```bash
# Dependencies utama
npm install pinia vue-router@4 axios

# shadcn-vue ecosystem
npm install reka-ui class-variance-authority clsx tailwind-merge tailwindcss-animate

# Utilities
npm install @vueuse/core @lucide/vue vue-sonner

# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer

# json-server untuk mock API
npm install -D json-server
```

Setelah semua terinstall, `package.json` akan berisi:

```json
{
  "dependencies": {
    "@lucide/vue": "^1.16.0",
    "@vueuse/core": "^10.11.0",
    "axios": "^1.7.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "pinia": "^2.1.7",
    "reka-ui": "^2.9.7",
    "tailwind-merge": "^2.3.0",
    "tailwindcss-animate": "^1.0.7",
    "vue": "^3.4.29",
    "vue-router": "^4.3.3",
    "vue-sonner": "^1.0.5"
  },
  "devDependencies": {
    "json-server": "^0.17.4",
    "tailwindcss": "^3.4.4",
    "postcss": "^8.4.39",
    "autoprefixer": "^10.4.19",
    "typescript": "^5.4.5",
    "vite": "^5.3.1",
    "vue-tsc": "^2.0.21"
  }
}
```

---

## 3. Setup Tailwind CSS

Buat file `tailwind.config.js` di root:

```js
import tailwindcssAnimate from 'tailwindcss-animate'

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      // warna menggunakan CSS variables supaya bisa diganti via :root
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
        // ... dst
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
```

Buat file `postcss.config.js`:

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

## 4. Setup CSS Variables (shadcn-vue style)

Ubah `src/assets/main.css` (atau buat baru) dengan isi:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 152 55% 48%;        /* hijau */
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 152 55% 48%;
    --radius: 0.75rem;
  }
}

@layer base {
  * { @apply border-border; }
  body { @apply bg-background text-foreground font-sans; }
}
```

> **Kenapa CSS variables?**
> Supaya warna bisa diubah dari satu tempat tanpa harus edit banyak file. Tailwind membaca variable ini via `hsl(var(--primary))`.

---

## 5. Setup shadcn-vue

Buat file `components.json` di root (konfigurasi untuk shadcn-vue CLI):

```json
{
  "$schema": "https://shadcn-vue.com/schema.json",
  "style": "default",
  "typescript": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/assets/main.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "composables": "@/composables",
    "utils": "@/lib/utils",
    "lib": "@/lib",
    "ui": "@/components/ui"
  }
}
```

Buat utility function `src/lib/utils.ts`:

```ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Menggabungkan class Tailwind dengan aman (tanpa konflik)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Kemudian install komponen shadcn-vue yang dibutuhkan. Karena CLI membutuhkan koneksi ke registry, komponen bisa di-fetch manual:

```bash
# Jika CLI bisa jalan normal:
npx shadcn-vue@latest add button card input textarea badge separator
```

---

## 6. Setup Environment Variable

Buat file `.env`:

```
VITE_API_URL=http://localhost:5051
```

> Prefix `VITE_` wajib ada agar variable bisa diakses di kode Vue via `import.meta.env.VITE_API_URL`.

---

## 7. Update index.html

Tambahkan Google Fonts Montserrat di `index.html`:

```html
<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Kulineran - Pesan Makanan Favoritmu</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
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

## Selesai!

Sekarang lanjut ke [02 — Struktur Folder](./02-struktur-folder.md).
