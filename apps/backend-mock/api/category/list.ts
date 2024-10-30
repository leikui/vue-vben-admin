import { verifyAccessToken } from '~/utils/jwt-utils';
import { unAuthorizedResponse } from '~/utils/response';

export default eventHandler(async (event) => {
  const userinfo = verifyAccessToken(event);
  if (!userinfo) {
    return unAuthorizedResponse(event);
  }
  // const { status, name } = await readBody(event);
  // const catory =
  // MOCK_CATGORYS.find((item) => item.name === name) ?? MOCK_CATGORYS;

  return useResponseSuccess(MOCK_CATGORYS);
});
