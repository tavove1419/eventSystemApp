import { RouteRecordRaw } from 'vue-router';
import AuthenticatedGuard from './auth-guards';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('src/modules/ecommerce/layouts/EcommerceLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('src/modules/ecommerce/pages/EcommercePage.vue')
      },
      {
        path:'purchase',
        component: () => import('src/modules/ecommerce/pages/PurchasePage.vue')
      },
      {
        path: 'sales',
        component: () => import('src/modules/ecommerce/pages/SalesPage.vue')
      }
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
  {
    path: '/login',
    component: () => import('../modules/authentication/layouts/LoginLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('../modules/authentication/pages/LoginPage.vue')
      }
    ]
  },
  {
    path: '/dashboard',
    name: 'HomeDashboard',
    beforeEnter: [AuthenticatedGuard],
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('pages/IndexPage.vue')
      },
      {
        path: 'event',
        name: 'Event',
        component: () => import('../modules/administration/pages/EventPage.vue')
      },
      {
        path: 'plan',
        name: 'Plan',
        component: () => import('../modules/administration/pages/PlanPage.vue')
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('../modules/administration/pages/UserPage.vue')
      },
      {
        path: 'referrer',
        name: 'Referrer',
        component: () => import('../modules/administration/pages/ReferrerPage.vue')
      },
      {
        path: 'winner',
        name: 'Winner',
        component: () => import('../modules/administration/pages/WinnerPage.vue')
      }
    ]
  }
];

export default routes;
