import type { RouteRecordStringComponent } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取积分列表
 */
export async function getScoreListApi(params: any) {
  return requestClient.get('/center/good/user/jifen/admin/list', params);
}
