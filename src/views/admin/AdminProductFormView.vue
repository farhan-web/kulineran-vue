<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Loader2, ImagePlus } from '@lucide/vue'
import { useAdminStore } from '@/stores/adminStore'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Breadcrumb from '@/components/common/Breadcrumb.vue'

const route = useRoute()
const router = useRouter()
const adminStore = useAdminStore()

// Cek apakah ini mode edit (ada :id di route) atau create
const isEdit = computed(() => !!route.params.id)
const productId = computed(() => Number(route.params.id))

const form = reactive({
  nama: '',
  harga: 0,
  deskripsi: '',
  kategori: '',
  isBest: false,
  stok: 0,
})

/** File gambar yang dipilih user */
const imageFile = ref<File | null>(null)
/** URL preview gambar — string blob untuk file baru, URL backend untuk edit */
const imagePreview = ref<string>('')

const breadcrumbs = computed(() => [
  { label: 'Home', to: '/' },
  { label: 'Admin', to: '/admin/products' },
  { label: isEdit.value ? 'Edit Produk' : 'Tambah Produk' },
])

// Mode edit: isi form dengan data produk yang ada
onMounted(async () => {
  if (isEdit.value) {
    // Fetch produk jika belum ada di store
    if (adminStore.products.length === 0) await adminStore.fetchProducts()
    const product = adminStore.products.find(p => p.id === productId.value)
    if (product) {
      form.nama = product.nama
      form.harga = product.harga
      form.deskripsi = product.deskripsi ?? ''
      form.kategori = product.kategori ?? ''
      form.isBest = (product as any).isBest ?? false
      form.stok = product.stok ?? 0
      imagePreview.value = product.gambar  // tampilkan gambar lama
    }
  }
})

/** Handler saat user pilih file gambar */
function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // Validasi tipe file
  if (!file.type.startsWith('image/')) {
    toast.error('File harus berupa gambar')
    return
  }
  // Validasi ukuran maks 2MB
  if (file.size > 2 * 1024 * 1024) {
    toast.error('Ukuran gambar maksimal 2MB')
    return
  }

  imageFile.value = file
  // Buat URL preview sementara dari file lokal
  imagePreview.value = URL.createObjectURL(file)
}

async function handleSubmit() {
  if (!form.nama.trim() || !form.harga) {
    toast.error('Nama dan harga wajib diisi')
    return
  }
  if (!isEdit.value && !imageFile.value) {
    toast.error('Gambar wajib diupload untuk produk baru')
    return
  }

  const payload = {
    ...form,
    gambar: imageFile.value ?? undefined,
  }

  try {
    if (isEdit.value) {
      await adminStore.updateProduct(productId.value, payload)
      toast.success('Produk berhasil diperbarui')
    } else {
      await adminStore.createProduct(payload)
      toast.success('Produk berhasil ditambahkan')
    }
    router.push('/admin/products')
  } catch {
    toast.error('Gagal menyimpan produk')
  }
}
</script>

<template>
  <main class="container py-10 max-w-2xl">
    <Breadcrumb :items="breadcrumbs" class="mb-6" />

    <h1 class="text-2xl font-bold mb-6">
      {{ isEdit ? 'Edit Produk' : 'Tambah Produk Baru' }}
    </h1>

    <form class="space-y-5" @submit.prevent="handleSubmit">

      <!-- Upload Gambar -->
      <div class="space-y-2">
        <label class="text-sm font-medium">
          Gambar Produk
          <span v-if="!isEdit" class="text-destructive">*</span>
          <span v-else class="text-muted-foreground font-normal">(kosongkan jika tidak diganti)</span>
        </label>

        <!-- Preview -->
        <div
          v-if="imagePreview"
          class="w-full aspect-video rounded-lg overflow-hidden border bg-muted"
        >
          <img :src="imagePreview" alt="Preview" class="w-full h-full object-cover" />
        </div>

        <!-- Input file -->
        <label
          class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
          :class="imagePreview ? 'border-muted' : 'border-primary/40'"
        >
          <div class="flex flex-col items-center gap-1 text-muted-foreground">
            <ImagePlus class="h-7 w-7" />
            <span class="text-sm">{{ imagePreview ? 'Ganti gambar' : 'Pilih gambar' }}</span>
            <span class="text-xs">PNG, JPG — maks 2MB</span>
          </div>
          <input type="file" accept="image/*" class="hidden" @change="onFileChange" />
        </label>
      </div>

      <!-- Nama -->
      <div class="space-y-2">
        <label class="text-sm font-medium" for="nama">Nama Produk <span class="text-destructive">*</span></label>
        <Input id="nama" v-model="form.nama" placeholder="Contoh: Nasi Goreng Spesial" :disabled="adminStore.isLoading" />
      </div>

      <!-- Harga -->
      <div class="space-y-2">
        <label class="text-sm font-medium" for="harga">Harga (Rp) <span class="text-destructive">*</span></label>
        <Input id="harga" v-model="form.harga" type="number" min="0" placeholder="Contoh: 15000" :disabled="adminStore.isLoading" />
      </div>

      <!-- Stok -->
      <div class="space-y-2">
        <label class="text-sm font-medium" for="stok">Stok <span class="text-destructive">*</span></label>
        <Input id="stok" v-model="form.stok" type="number" min="0" placeholder="Contoh: 50" :disabled="adminStore.isLoading" />
      </div>

      <!-- Kategori -->
      <div class="space-y-2">
        <label class="text-sm font-medium" for="kategori">Kategori</label>
        <Input id="kategori" v-model="form.kategori" placeholder="Contoh: Nasi, Mie, Minuman" :disabled="adminStore.isLoading" />
      </div>

      <!-- Deskripsi -->
      <div class="space-y-2">
        <label class="text-sm font-medium" for="deskripsi">Deskripsi</label>
        <Textarea id="deskripsi" v-model="form.deskripsi" placeholder="Deskripsi singkat produk..." :rows="3" :disabled="adminStore.isLoading" />
      </div>

      <!-- Produk Unggulan -->
      <div class="flex items-center gap-3">
        <input
          id="isBest"
          v-model="form.isBest"
          type="checkbox"
          class="h-4 w-4 rounded border accent-primary cursor-pointer"
          :disabled="adminStore.isLoading"
        />
        <label for="isBest" class="text-sm font-medium cursor-pointer">
          Tampilkan sebagai produk unggulan di halaman Home
        </label>
      </div>

      <!-- Tombol -->
      <div class="flex gap-3 pt-2">
        <Button type="submit" :disabled="adminStore.isLoading" class="gap-2">
          <Loader2 v-if="adminStore.isLoading" class="h-4 w-4 animate-spin" />
          {{ isEdit ? 'Simpan Perubahan' : 'Tambah Produk' }}
        </Button>
        <Button type="button" variant="outline" @click="router.push('/admin/products')">
          Batal
        </Button>
      </div>

    </form>
  </main>
</template>
