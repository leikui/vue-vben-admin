import type { RouteRecordRaw } from 'vue-router';

import {
  VBEN_DOC_URL,
  VBEN_ELE_PREVIEW_URL,
  VBEN_GITHUB_URL,
  VBEN_LOGO_URL,
  VBEN_NAIVE_PREVIEW_URL,
} from '@vben/constants';

import { BasicLayout, IFrameView } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: "ic:baseline-view-in-ar",
      order: 9999,
      title:'积分管理',
      authority: ['admin'],
    },
    name: 'Scores',
    path: '/demos',
    children: [
      {
        name: '用户积分列表',
        path: '/demos/score',
        component: () => import('#/views/demos/score/index.vue'),
      },
    ],
  },

];

export default routes;
