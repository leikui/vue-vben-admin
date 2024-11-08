
import { requestClient } from '#/api/request';

/**
 * 获取用户信息
 */
export async function getCategoryApi(params: any) {
  return requestClient.get('/category/list',{params});
}
