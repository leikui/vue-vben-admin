import { baseRequestClient, requestClient } from '#/api/request';



/**
 * 获取商品分类
 */
export async function getCategoryApi(param) {
  return requestClient.get('category/list',param);
}
