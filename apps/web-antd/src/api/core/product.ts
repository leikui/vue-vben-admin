
import { requestClient } from '#/api/request';

/**
 * 商品分类
 */
export async function getCategoryApi(params: any) {
  return requestClient.get('/center/good/category/list/tree',params);
}

/**
 * 获取用户信息
 */
export async function getAttrApi(params: any) {
  return requestClient.get('/product/attr/list',params);
}

/**
 * 获取商品列表
 */
export async function getProductApi(params: any) {
  return requestClient.get('/center/good/web/product/list',params);
}

/**
 * 获取用户信息
 */
export async function getProductInfoApi(params: any) {
  return requestClient.get('/product/product/'+params);
}

/**
 * 获取订单列表
 */
export async function getProductOrderListApi(params: any) {
  console.log(params);

  return requestClient.get('/center/good/store/order/list', params);
}

/**
 * 获取订单详情
 */
export async function getProductOrderDetailApi(params: any) {
  return requestClient.get('/center/good/store/order/info', params);
}


/**
 * 保存分类
 */
export async function saveCategoryApi(params: any) {
  return requestClient.post('/center/good/category/save', params);
}
