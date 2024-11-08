import { verifyAccessToken } from '~/utils/jwt-utils';
import { MOCK_CATEGORY } from '~/utils/mock-data';
import { unAuthorizedResponse } from '~/utils/response';

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }

  const category = MOCK_CATEGORY?? [];
  // return useResponseSuccess(category);
  const { page, pageSize } = getQuery(event);
  return useResponseSuccess(category);
});
