
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
 * 获取商品详情
 */
export async function getProductInfoApi(params: any) {
  return requestClient.get('/center/good/web/product/info',params);
}

/**
 * 保存商品
 */
export async function saveProductApi(params: any) {
  return requestClient.post('/center/good/web/product/save',params);
}
/**
 * 删除商品
 */
export async function deleteProductApi(params: any) {
  return requestClient.post('/center/good/web/product/delete',params);
}
/**
 * 商品上架
 */
export async function upProductApi(params: any) {
  return requestClient.get('/center/good/web/product/putOnShell',params);
}
/**
 * 商品下架
 */
export async function downProductApi(params: any) {
  return requestClient.get('/center/good/web/product/offShell',params);
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
  return requestClient.post('/center/good/category/save', params );
}
/**
 * 删除分类
 */
export async function deleteCategoryApi(params: any) {
  return requestClient.get('/center/good/category/delete', params );
}

/**
 * 更新分类
 */
export async function updateCategoryApi(params: any) {
  return requestClient.post('/center/good/category/update', params );
}

/**
 * 获取商品规格列表
 */
export async function getProductRuleListApi(params: any) {
  return requestClient.get('/center/good/product/rule/list', params );
}

/**
 * 保存商品规格
 */
export async function saveProductRuleApi(params: any) {
  return requestClient.post('/center/good/product/rule/save', params );
}

/**
 * 更新商品规格
 */
export async function updateProductRuleApi(params: any) {
  return requestClient.post('/center/good/product/rule/update', params );
}

/**
 * 获取开票列表
 */
export async function getInvoiceListApi(params: any) {
  return requestClient.get('/center/good/invoice/list', params );
}
