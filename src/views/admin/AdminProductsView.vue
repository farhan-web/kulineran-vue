<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { Plus, Pencil, Trash2, Loader2, PackageOpen } from '@lucide/vue'
import { useAdminStore } from '@/stores/adminStore'
import { useCartStore } from '@/stores/cartStore'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const adminStore = useAdminStore()
const cartStore = useCartStore()

onMounted(() => adminStore.fetchProducts())

async function handleDelete(id: number, nama: string) {
  if (!confirm(`Hapus produk "${nama}"?`)) return
  try {
    await adminStore.deleteProduct(id)
    toast.success(`Produk "${nama}" berhasil dihapus`)
  } catch {
    toast.error('Gagal menghapus produk')
  }
}
</script>

<template>
  <main class="container py-10">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold">Kelola Produk</h1>
        <p class="text-muted-foreground text-sm mt-1">
          {{ adminStore.products.length }} produk terdaftar
        </p>
      </div>
      <RouterLink to="/admin/products/create">
        <Button class="gap-2">
          <Plus class="h-4 w-4" />
          Tambah Produk
        </Button>
      </RouterLink>
    </div>

    <Separator class="mb-6" />

    <!-- Loading -->
    <div v-if="adminStore.isLoading" class="flex justify-center py-20">
      <Loader2 class="h-8 w-8 animate-spin text-primary" />
    </div>

    <!-- Empty -->
    <div v-else-if="adminStore.products.length === 0" class="text-center py-20 text-muted-foreground">
      <PackageOpen class="h-12 w-12 mx-auto mb-3 opacity-40" />
      <p>Belum ada produk. Tambah produk pertama!</p>
    </div>

    <!-- Tabel produk -->
    <div v-else class="rounded-lg border overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-muted text-muted-foreground">
          <tr>
            <th class="text-left p-3 font-medium">Produk</th>
            <th class="text-left p-3 font-medium hidden md:table-cell">Kategori</th>
            <th class="text-left p-3 font-medium">Harga</th>
            <th class="text-center p-3 font-medium hidden sm:table-cell">Stok</th>
            <th class="text-center p-3 font-medium hidden sm:table-cell">Unggulan</th>
            <th class="text-right p-3 font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="product in adminStore.products"
            :key="product.id"
            class="border-t hover:bg-muted/30 transition-colors"
          >
            <!-- Gambar + Nama -->
            <td class="p-3">
              <div class="flex items-center gap-3">
                <img
                  :src="product.gambar"
                  :alt="product.nama"
                  class="h-12 w-12 rounded-md object-cover shrink-0"
                />
                <div>
                  <p class="font-medium line-clamp-1">{{ product.nama }}</p>
                  <p class="text-muted-foreground text-xs line-clamp-1 hidden sm:block">
                    {{ product.deskripsi || '—' }}
                  </p>
                </div>
              </div>
            </td>

            <!-- Kategori -->
            <td class="p-3 hidden md:table-cell text-muted-foreground">
              {{ product.kategori || '—' }}
            </td>

            <!-- Harga -->
            <td class="p-3 font-medium text-primary">
              Rp {{ cartStore.formatPrice(product.harga) }}
            </td>

            <!-- Stok -->
            <td class="p-3 text-center hidden sm:table-cell">
              <Badge v-if="product.stok === 0" variant="destructive">Habis</Badge>
              <span v-else class="font-medium">{{ product.stok }}</span>
            </td>

            <!-- Badge Unggulan -->
            <td class="p-3 text-center hidden sm:table-cell">
              <Badge v-if="product.isBest" variant="default">Unggulan</Badge>
              <span v-else class="text-muted-foreground">—</span>
            </td>

            <!-- Aksi -->
            <td class="p-3">
              <div class="flex items-center justify-end gap-2">
                <RouterLink :to="`/admin/products/${product.id}/edit`">
                  <Button variant="outline" size="icon" title="Edit">
                    <Pencil class="h-4 w-4" />
                  </Button>
                </RouterLink>
                <Button
                  variant="destructive"
                  size="icon"
                  title="Hapus"
                  :disabled="adminStore.isLoading"
                  @click="handleDelete(product.id, product.nama)"
                >
                  <Trash2 class="h-4 w-4" />
                </Button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>
