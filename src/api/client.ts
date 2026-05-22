// ============================================================
// API CLIENT
// Instance Axios dengan JWT interceptor.
// Token diambil dari localStorage dan disisipkan otomatis di setiap request.
// Jika response 401, token dihapus dan user diarahkan ke halaman login.
// ============================================================

import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Sisipkan JWT token secara otomatis di setiap request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Jika token expired / tidak valid, bersihkan storage dan arahkan ke login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default apiClient
