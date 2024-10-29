import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: '商品管理',
    },
    name: 'Shop',
    path: '/shop',
    children: [
      {
        meta: {
          title: '商品分类',
        },
        name: 'Catgory',
        path: '/shop/catgory',
        component: () => import('#/views/shop/catgory/index.vue'),
      },
    ],
  },
];

export default routes;
