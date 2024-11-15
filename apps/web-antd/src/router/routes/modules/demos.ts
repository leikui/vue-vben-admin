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
      title: $t('demos.title'),
    },
    name: 'Demos',
    path: '/demos',
    children: [
      {
        meta: {
          title: $t('demos.antd'),
        },
        name: 'AntDesignDemos',
        path: '/demos/ant-design',
        component: () => import('#/views/demos/antd/index.vue'),
      },


      {
        meta: {
          title: '商品',
        },
        name: 'Category',
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
        name: 'Order',
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

        ]
      },

    ],
  },
];

export default routes;
