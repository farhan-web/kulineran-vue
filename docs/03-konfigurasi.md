# 03 — Konfigurasi

## vite.config.ts

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5050          // dev server berjalan di port 5050
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
```

**Yang penting:**
- `plugins: [vue()]` — mengaktifkan support untuk file `.vue`
- `server.port: 5050` — port custom untuk dev server
- `alias '@'` — shortcut path, jadi `import X from '@/components/...'` sama dengan `import X from './src/components/...'`

---

## tsconfig.json

Project menggunakan **3 file tsconfig** agar TypeScript bisa handle baik kode browser maupun kode Node (vite config):

### tsconfig.json (root — hanya referensi)
```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.node.json" },
    { "path": "./tsconfig.app.json" }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]     // alias @ dikenali TypeScript
    }
  }
}
```

### tsconfig.app.json (untuk kode src/)
```json
{
  "extends": "@vue/tsconfig/tsconfig.dom.json",
  "include": ["env.d.ts", "src/**/*", "src/**/*.vue"],
  "compilerOptions": {
    "composite": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

`@vue/tsconfig/tsconfig.dom.json` sudah mengatur setting TypeScript yang tepat untuk Vue (strict mode, DOM types, dll).

### tsconfig.node.json (untuk vite.config.ts)
```json
{
  "compilerOptions": {
    "composite": true,
    "noEmit": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "target": "ES2022"
  },
  "include": ["vite.config.*"]
}
```

---

## tailwind.config.js

```js
import tailwindcssAnimate from 'tailwindcss-animate'

export default {
  darkMode: ['class'],       // dark mode diaktifkan via class
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
      colors: {
        // SEMUA warna baca dari CSS variables di main.css
        // Jadi untuk ganti warna, edit :root di main.css, bukan di sini
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... dst
      },
      borderRadius: {
        // radius juga dari CSS variable
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [tailwindcssAnimate],   // animasi accordion, dll
}
```

**Pola warna dengan CSS variables:**
```
tailwind.config.js        main.css (:root)
─────────────────         ──────────────────────────────
primary: hsl(var(--primary))  ←  --primary: 152 55% 48%;
```

Ini artinya class `bg-primary` di template akan mengambil nilai dari `--primary` di CSS.

---

## postcss.config.js

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

PostCSS memproses CSS sebelum dikirim ke browser. `tailwindcss` generate utility classes, `autoprefixer` tambah prefix vendor (-webkit-, dll) otomatis.

---

## components.json

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
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```

File ini dibaca oleh CLI `npx shadcn-vue@latest add [component]` saat menambah komponen baru. Dengan file ini sudah ada, perintah add tidak perlu tanya-tanya lagi.

---

## .env

```
VITE_API_URL=http://localhost:5051
```

Dibaca di `src/api/client.ts` via `import.meta.env.VITE_API_URL`.

> **Penting:** Semua env variable di Vite **harus** diawali `VITE_` agar bisa diakses dari kode frontend. Variable tanpa prefix hanya bisa diakses di sisi Node (vite config).

---

## package.json — Scripts

```json
{
  "scripts": {
    "dev": "vite",                                    // jalankan dev server
    "dev:api": "json-server --watch db.json --port 5051",  // jalankan mock API
    "build": "vue-tsc && vite build",                 // type check lalu build
    "preview": "vite preview",                        // preview hasil build
    "lint": "eslint . --ext .vue,.ts,.tsx --fix"      // lint dan auto-fix
  }
}
```
