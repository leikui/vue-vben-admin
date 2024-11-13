
import { requestClient } from '#/api/request';

/**
 * 获取用户信息
 */
export async function getCategoryApi(params: any) {
  return requestClient.get('/product/category/list',{params});
}

/**
 * 获取用户信息
 */
export async function getAttrApi(params: any) {
  return requestClient.get('/product/attr/list',{params});
}

/**
 * 获取用户信息
 */
export async function getProductApi(params: any) {
  return requestClient.get('/product/product/list',{params});
}
