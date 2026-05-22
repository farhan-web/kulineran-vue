// ============================================================
// AUTH STORE (Pinia)
// Mengelola state autentikasi: login, register, logout.
// Token JWT disimpan di localStorage agar persist setelah refresh.
// Interceptor di api/client.ts otomatis sisipkan token ke setiap request.
// ============================================================

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { AuthUser, LoginPayload, RegisterPayload } from '@/types'
import { authApi } from '@/api/endpoints'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const route = useRoute()

  // ── STATE ────────────────────────────────────────────────

  /**
   * JWT token untuk autentikasi request ke backend.
   * Dibaca dari localStorage saat store pertama kali dibuat (persist saat refresh).
   * Interceptor di client.ts otomatis sisipkan token ini ke header Authorization.
   */
  const token = ref<string | null>(localStorage.getItem('token'))

  /**
   * Data user yang sedang login.
   * Diinisialisasi dari localStorage agar tidak hilang saat refresh.
   * null = belum login.
   */
  const user = ref<AuthUser | null>(
    JSON.parse(localStorage.getItem('user') ?? 'null'),
  )

  /** true saat sedang proses login/register ke API */
  const isLoading = ref(false)

  /** Pesan error dari API, contoh: "Username atau password salah" */
  const error = ref<string | null>(null)

  // ── GETTERS ──────────────────────────────────────────────

  /** true jika user sudah login (ada token) */
  const isLoggedIn = computed(() => !!token.value)

  // ── ACTIONS ──────────────────────────────────────────────

  /**
   * Login dengan username dan password.
   * Jika berhasil, simpan token & user ke state + localStorage, lalu redirect ke Home.
   *
   * Langkah:
   * 1. Set isLoading = true, reset error
   * 2. POST /auth/login → dapat token + user
   * 3. Simpan ke state dan localStorage
   * 4. Redirect ke '/'
   *
   * @param payload - { username, password }
   */
  async function login(payload: LoginPayload) {
    isLoading.value = true
    error.value = null
    try {
      const res = await authApi.login(payload)

      // Simpan ke state
      token.value = res.token
      user.value = res.user

      // Simpan ke localStorage agar persist saat browser di-refresh
      localStorage.setItem('token', res.token)
      localStorage.setItem('user', JSON.stringify(res.user))

      // Redirect ke halaman asal jika ada query ?redirect=..., fallback ke home
      const redirectTo = (route.query.redirect as string) || '/'
      await router.push(redirectTo)
    } catch (err: unknown) {
      // Ambil pesan error dari response backend, fallback ke pesan default
      const e = err as { response?: { data?: { message?: string } } }
      error.value = e.response?.data?.message ?? 'Login gagal, coba lagi.'
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Register akun baru.
   * Jika berhasil, redirect ke halaman login.
   *
   * @param payload - { username, password }
   */
  async function register(payload: RegisterPayload) {
    isLoading.value = true
    error.value = null
    try {
      await authApi.register(payload)
      await router.push('/login')
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      error.value = e.response?.data?.message ?? 'Registrasi gagal, coba lagi.'
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Logout: bersihkan token dan user dari state + localStorage, redirect ke login.
   * Interceptor di client.ts akan berhenti kirim token setelah ini.
   */
  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  return { token, user, isLoading, error, isLoggedIn, login, register, logout }
})
