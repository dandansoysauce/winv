import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Dashboard from '../views/Dashboard.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    children: [
      {
        path: '/',
        name: 'DashboardHome',
        component: () => import('../views/DashboardHome.vue'),
      },
      {
        path: 'products',
        name: 'DashboardProducts',
        component: () => import('../views/DashboardProducts.vue'),
      },
      {
        path: 'producttypes',
        name: 'DashboardProductTypes',
        component: () => import('../views/DashboardProductTypes.vue'),
      },
      {
        path: 'sales',
        name: 'DashboardSales',
        component: () => import('../views/DashboardSales.vue'),
      },
      {
        path: 'suppliers',
        name: 'DashboardSuppliers',
        component: () => import('../views/DashboardSuppliers.vue'),
      },
      {
        path: 'users',
        name: 'DashboardUsers',
        component: () => import('../views/DashboardUsers.vue'),
      },
    ],
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
