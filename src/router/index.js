import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue';
import CartView from '@/views/CartView.vue';
import LoginView from '@/views/LoginView.vue';
import ProfileView from '@/views/ProfileView.vue';
import CreateOrderView from '@/views/CreateOrderView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
  },
  {
    path: '/cart',
    name: 'cart',
    component: CartView,
  },
  {
    path: '/cart/order',
    name: 'order',
    component: CreateOrderView,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path:'/profile',
    name: 'profile',
    component: ProfileView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const accessToken = localStorage.getItem('access_token');
  if (to.name !== 'home' && to.name !== 'login' && !accessToken) {
    return next({ name: 'login' });
  }
  next();
});


export default router
