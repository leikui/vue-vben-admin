import { verifyAccessToken } from '~/utils/jwt-utils';
import { MOCK_CATEGORY } from '~/utils/mock-data';
import { unAuthorizedResponse } from '~/utils/response';

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const attr = MOCK_PRODUCT_ATTR?? [];
  // return useResponseSuccess(category);
  const { page, pageSize } = getQuery(event);
  return usePageResponseSuccess( page as string, pageSize as string,attr);
});
