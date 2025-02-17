import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: '商城',
    },
    name: 'Demos',
    path: '/demos',
    children: [

      {
        meta: {
          title: '商品',
        },
        name: 'Poducts',
        path: '/demos/product',
        children: [
          {
            meta: {
              title: '商品分类',
            },
            name: 'Category',
            path: '/demos/product/category',
            component: () => import('#/views/demos/product/category/index.vue'),
          },
          {
            meta: {
              title: '商品规格',
            },
            name: 'Attr',
            path: '/demos/product/attr',
            component: () => import('#/views/demos/product/attr/index.vue'),
          },
          {
            meta: {
              title: '商品管理',
            },
            name: 'Product',
            path: '/demos/product/product',
            component: () => import('#/views/demos/product/product/index.vue'),
          },
          {
            meta: {
              title: '新增商品',
              hideInMenu: true,
              hideChildrenInMenu: true,
              hideInBreadcrumb: true,
              hideInTab: true,
            },
            name: 'Add',
            path: '/demos/product/add',
            component: () => import('#/views/demos/product/add/index.vue'),
          },
        ]
      },
      {
        meta: {
          title: '订单',
        },
        name: 'Orders',
        path: '/demos/order',
        children: [
          {
            meta: {
              title: '订单管理',
            },
            name: 'Order',
            path: '/demos/product/order',
            component: () => import('#/views/demos/product/order/index.vue'),
          },
          {
            meta: {
              title: '开票管理',
            },
            name: 'Invoice',
            path: '/demos/product/invoice',
            component: () => import('#/views/demos/product/invoice/index.vue'),
          },
        ]
      },
  {
    meta: {
      icon: "ic:baseline-view-in-ar",
      order: 9999,
      title:'积分管理',
      authority: ['admin'],
    },
    name: 'Scores',
    path: '/scores',
    children: [
      {
        name: 'score',
        path: '/demos/score',
        meta: {
          title: '用户积分列表',
        },
        component: () => import('#/views/demos/score/index.vue'),
      },
    ],
  },
    ],
  },
];

export default routes;
