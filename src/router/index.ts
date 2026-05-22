import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

// Route yang butuh login
const authRequired = ['cart', 'order-success', 'profile']

// Route yang hanya boleh diakses ADMIN
const adminRoutes = ['admin-products', 'admin-products-create', 'admin-products-edit']

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/foods',
      name: 'foods',
      component: () => import('@/views/FoodsView.vue'),
    },
    {
      path: '/foods/:id',
      name: 'food-detail',
      component: () => import('@/views/FoodDetailView.vue'),
    },
    {
      path: '/keranjang',
      name: 'cart',
      component: () => import('@/views/CartView.vue'),
    },
    {
      path: '/pesanan-sukses',
      name: 'order-success',
      component: () => import('@/views/OrderSuccessView.vue'),
    },
    {
      path: '/profil',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
    },
    // ── ADMIN ROUTES ──────────────────────────────────────────
    {
      path: '/admin/products',
      name: 'admin-products',
      component: () => import('@/views/admin/AdminProductsView.vue'),
    },
    {
      path: '/admin/products/create',
      name: 'admin-products-create',
      component: () => import('@/views/admin/AdminProductFormView.vue'),
    },
    {
      path: '/admin/products/:id/edit',
      name: 'admin-products-edit',
      component: () => import('@/views/admin/AdminProductFormView.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

// Navigation guard
router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  const isLoggedIn = !!token

  // Halaman login/register: redirect ke home jika sudah login
  if ((to.name === 'login' || to.name === 'register') && isLoggedIn) return { name: 'home' }

  // Protected routes: redirect ke login jika belum login
  // Simpan path tujuan di query redirect agar bisa balik setelah login
  if (authRequired.includes(to.name as string) && !isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // Admin routes: harus login + role ADMIN
  if (adminRoutes.includes(to.name as string)) {
    if (!isLoggedIn) return { name: 'login', query: { redirect: to.fullPath } }
    // Baca user dari localStorage untuk cek role
    const userStr = localStorage.getItem('user')
    const user = userStr ? JSON.parse(userStr) : null
    if (user?.role !== 'ADMIN') return { name: 'home' }
  }
})

export default router
