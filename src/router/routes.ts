import { RouteRecordRaw } from 'vue-router';

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
  }
];

export default routes;
