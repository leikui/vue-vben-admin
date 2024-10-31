import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse } from '~/utils/response';

export default eventHandler((event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }
  const query = getQuery(event);

  const catory = MOCK_CATGORYS.find((item) => item.name === query.name) ?? MOCK_CATGORYS;

  return useResponseSuccess(catory);
});
