<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ChefHat } from '@lucide/vue'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const confirmPassword = ref('')

// Cek apakah confirm password cocok dengan password
// Hanya tampilkan error jika confirm password sudah diisi
const passwordMismatch = computed(
  () => confirmPassword.value.length > 0 && confirmPassword.value !== password.value
)

async function handleRegister() {
  if (!username.value.trim() || !password.value.trim() || !confirmPassword.value.trim()) {
    toast.error('Semua field wajib diisi')
    return
  }

  if (password.value !== confirmPassword.value) {
    toast.error('Password dan konfirmasi password tidak cocok')
    return
  }

  if (password.value.length < 6) {
    toast.error('Password minimal 6 karakter')
    return
  }

  await authStore.register({ username: username.value, password: password.value })

  if (authStore.error) {
    toast.error(authStore.error)
  } else {
    toast.success('Registrasi berhasil! Silakan login.')
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-muted/40 px-4">
    <Card class="w-full max-w-sm">
      <CardHeader class="text-center">
        <div class="flex justify-center mb-2">
          <div class="flex items-center gap-2 text-primary">
            <ChefHat class="h-8 w-8" />
          </div>
        </div>
        <CardTitle class="text-2xl">Daftar Akun</CardTitle>
        <CardDescription>Buat akun baru untuk mulai memesan</CardDescription>
      </CardHeader>

      <CardContent>
        <form class="space-y-4" @submit.prevent="handleRegister">
          <div class="space-y-2">
            <label class="text-sm font-medium" for="username">Username</label>
            <Input
              id="username"
              v-model="username"
              placeholder="Masukkan username"
              autocomplete="username"
              :disabled="authStore.isLoading"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium" for="password">Password</label>
            <Input
              id="password"
              v-model="password"
              type="password"
              placeholder="Minimal 6 karakter"
              autocomplete="new-password"
              :disabled="authStore.isLoading"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium" for="confirm-password">Konfirmasi Password</label>
            <Input
              id="confirm-password"
              v-model="confirmPassword"
              type="password"
              placeholder="Ulangi password"
              autocomplete="new-password"
              :disabled="authStore.isLoading"
              :class="passwordMismatch ? 'border-destructive focus-visible:ring-destructive' : ''"
            />
            <!-- Pesan error muncul saat confirm password tidak cocok -->
            <p v-if="passwordMismatch" class="text-sm text-destructive">
              Password tidak cocok
            </p>
          </div>

          <Button
            type="submit"
            class="w-full"
            :disabled="authStore.isLoading || passwordMismatch"
          >
            {{ authStore.isLoading ? 'Memproses...' : 'Daftar' }}
          </Button>
        </form>

        <p class="text-center text-sm text-muted-foreground mt-4">
          Sudah punya akun?
          <RouterLink to="/login" class="text-primary font-medium hover:underline">
            Masuk di sini
          </RouterLink>
        </p>
      </CardContent>
    </Card>
  </div>
</template>
