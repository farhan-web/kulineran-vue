<script setup lang="ts">
import { ref } from 'vue'
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
const isLoading = ref(false)

async function handleLogin() {
  if (!username.value.trim() || !password.value.trim()) {
    toast.error('Username dan password wajib diisi')
    return
  }

  isLoading.value = true
  try {
    await authStore.login({ username: username.value, password: password.value })
    toast.success(`Selamat datang, ${authStore.user?.username}!`)
  } catch (err: any) {
    const msg = err?.response?.data?.message ?? 'Login gagal, coba lagi'
    toast.error(msg)
  } finally {
    isLoading.value = false
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
        <CardTitle class="text-2xl">Kulineran</CardTitle>
        <CardDescription>Masuk untuk mulai memesan</CardDescription>
      </CardHeader>

      <CardContent>
        <form class="space-y-4" @submit.prevent="handleLogin">
          <div class="space-y-2">
            <label class="text-sm font-medium" for="username">Username</label>
            <Input
              id="username"
              v-model="username"
              placeholder="Masukkan username"
              autocomplete="username"
              :disabled="isLoading"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium" for="password">Password</label>
            <Input
              id="password"
              v-model="password"
              type="password"
              placeholder="Masukkan password"
              autocomplete="current-password"
              :disabled="isLoading"
            />
          </div>

          <Button type="submit" class="w-full" :disabled="isLoading">
            {{ isLoading ? 'Memproses...' : 'Masuk' }}
          </Button>
        </form>

        <p class="text-center text-sm text-muted-foreground mt-4">
          Belum punya akun?
          <RouterLink to="/register" class="text-primary font-medium hover:underline">
            Daftar di sini
          </RouterLink>
        </p>
      </CardContent>
    </Card>
  </div>
</template>
