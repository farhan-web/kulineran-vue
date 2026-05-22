# 07 — shadcn-vue Components

shadcn-vue adalah kumpulan komponen UI yang di-generate langsung ke dalam project (bukan library eksternal yang di-install). Komponen ada di `src/components/ui/`.

---

## Apa Itu shadcn-vue?

shadcn-vue **bukan** npm package seperti biasa. Ia adalah koleksi komponen yang bisa di-copy ke project, lalu dimodifikasi sesuai kebutuhan. Di balik layar, ia menggunakan:

- **reka-ui** — komponen headless yang accessible (keyboard navigation, ARIA, dll)
- **Tailwind CSS** — untuk styling
- **class-variance-authority (cva)** — untuk variant system (primary, secondary, outline, dll)
- **clsx + tailwind-merge** — untuk merge class dengan aman

---

## Utility: `src/lib/utils.ts`

```ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

`cn()` adalah fungsi kecil tapi penting. Fungsinya menggabungkan class Tailwind tanpa konflik:

```ts
// Tanpa cn(): class bisa konflik
'bg-red-500 bg-blue-500'   // dua warna background, Tailwind bingung mana yang dipakai

// Dengan cn(): tailwind-merge otomatis resolve konflik
cn('bg-red-500', 'bg-blue-500')   // → 'bg-blue-500' (yang terakhir menang)

// Juga bisa conditional class (via clsx):
cn('p-4', isActive && 'bg-primary', !isActive && 'bg-secondary')
```

---

## Button

**File:** `src/components/ui/button/`

```ts
// index.ts — definisi variants menggunakan cva()
export const buttonVariants = cva(
  // base class yang selalu ada
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium...",
  {
    variants: {
      variant: {
        default:     "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground...",
        outline:     "border border-input bg-background hover:bg-accent...",
        secondary:   "bg-secondary text-secondary-foreground...",
        ghost:       "hover:bg-accent hover:text-accent-foreground",
        link:        "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:  "h-10 px-4 py-2",
        sm:       "h-9 rounded-md px-3",
        lg:       "h-11 rounded-md px-8",
        icon:     "h-10 w-10",
        "icon-sm": "size-9",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

```vue
<!-- Button.vue — menggunakan Primitive dari reka-ui -->
<script setup lang="ts">
import { Primitive } from "reka-ui"
import { cn } from "@/lib/utils"
import { buttonVariants } from "."

const props = withDefaults(defineProps<{
  variant?: ButtonVariants["variant"]
  size?: ButtonVariants["size"]
  class?: string
  as?: string        // bisa render sebagai <button>, <a>, dll
  asChild?: boolean  // ambil alih rendering dari child element
}>(), { as: "button" })
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <slot />
  </Primitive>
</template>
```

**Cara pakai:**
```vue
<Button>Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="destructive" size="sm">Hapus</Button>
<Button size="icon"><Trash2 /></Button>
<Button disabled>Tidak Aktif</Button>
```

---

## Card

**File:** `src/components/ui/card/`

Terdiri dari 6 sub-komponen yang dipakai bersama:

```vue
<Card>
  <CardHeader>
    <CardTitle>Judul</CardTitle>
    <CardDescription>Deskripsi singkat</CardDescription>
  </CardHeader>
  <CardContent>
    Konten utama card
  </CardContent>
  <CardFooter>
    <Button>Aksi</Button>
  </CardFooter>
</Card>
```

Semua komponen hanya wrapper `<div>` dengan class Tailwind:
```ts
// Card.vue
cn('rounded-lg border bg-card text-card-foreground shadow-sm', props.class)

// CardHeader.vue
cn('flex flex-col gap-y-1.5 p-6', props.class)

// CardContent.vue
cn('p-6 pt-0', props.class)
```

---

## Input

**File:** `src/components/ui/input/`

```vue
<script setup lang="ts">
import { useVModel } from "@vueuse/core"

const props = defineProps<{
  modelValue?: string | number
  defaultValue?: string | number
  class?: string
}>()

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void
}>()

// useVModel dari @vueuse/core — handle v-model secara otomatis
const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue,
})
</script>

<template>
  <input v-model="modelValue" :class="cn('flex h-10 w-full rounded-md border...', props.class)">
</template>
```

`useVModel` dari @vueuse/core menangani pola v-model dua arah secara otomatis.

**Cara pakai:**
```vue
<Input v-model="search" placeholder="Cari..." />
<Input v-model="jumlah" type="number" :min="1" />
```

---

## Textarea

Sama dengan Input tapi menggunakan `<textarea>`:

```vue
<Textarea v-model="keterangan" placeholder="Catatan tambahan..." :rows="3" />
```

---

## Badge

**File:** `src/components/ui/badge/`

```ts
// index.ts — menggunakan cva untuk variants
export const badgeVariants = cva(
  "inline-flex gap-1 items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold...",
  {
    variants: {
      variant: {
        default:     "border-transparent bg-primary text-primary-foreground...",
        secondary:   "border-transparent bg-secondary...",
        destructive: "border-transparent bg-destructive...",
        outline:     "text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
)
```

**Cara pakai:**
```vue
<Badge>3</Badge>                           <!-- jumlah item keranjang -->
<Badge variant="secondary">Baru</Badge>
<Badge variant="destructive">Habis</Badge>
<Badge variant="outline">Kategori</Badge>
```

---

## Separator

**File:** `src/components/ui/separator/`

Menggunakan `Separator` dari **reka-ui** yang sudah punya ARIA role yang benar:

```vue
<script setup lang="ts">
import { Separator } from "reka-ui"
import { reactiveOmit } from "@vueuse/core"

// reactiveOmit = buat objek props baru tapi skip key 'class'
// supaya props bisa di-spread ke reka-ui Separator tanpa konflik
const delegatedProps = reactiveOmit(props, "class")
</script>

<template>
  <Separator
    v-bind="delegatedProps"
    :class="cn('shrink-0 bg-border', orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full', props.class)"
  />
</template>
```

**Cara pakai:**
```vue
<Separator />                           <!-- horizontal (default) -->
<Separator orientation="vertical" />    <!-- vertical -->
```

---

## Cara Tambah Komponen Baru

Karena `components.json` sudah ada, cukup jalankan:

```bash
npx shadcn-vue@latest add [nama-komponen]
```

Contoh:
```bash
npx shadcn-vue@latest add dialog
npx shadcn-vue@latest add select
npx shadcn-vue@latest add toast
```

Komponen baru akan ditambahkan ke `src/components/ui/`.
