import { verifyAccessToken } from '~/utils/jwt-utils';
import { MOCK_CATEGORY } from '~/utils/mock-data';
import { unAuthorizedResponse } from '~/utils/response';

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }
  const id = await getRouterParam(event, 'id')

  const prod = Object.values(MOCK_PRODUCT).filter(item =>  item.id == id);

  return useResponseSuccess(prod[0]);
});
