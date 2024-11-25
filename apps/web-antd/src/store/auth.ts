
import type { UserInfo } from '@vben/types';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { DEFAULT_HOME_PATH, LOGIN_PATH } from '@vben/constants';
import { resetAllStores, useAccessStore, useUserStore } from '@vben/stores';

import { notification } from 'ant-design-vue';
import { defineStore } from 'pinia';

import { getAccessCodesApi, getUserInfoApi,getUserDetailAPI, loginApi,getDictAllAPI,getDockerUnits } from '#/api';
import { $t } from '#/locales';

export const useAuthStore = defineStore('auth', () => {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const router = useRouter();

  const loginLoading = ref(false);

  /**
   * 异步处理登录操作
   * Asynchronously handle the login process
   * @param params 登录表单数据
   */
  async function authLogin(
    params: any,
    onSuccess?: () => Promise<void> | void,
  ) {
    // 异步处理用户登录操作并获取 accessToken
    let userInfo: null | any = null;
    try {
      loginLoading.value = true;
      const { access_token, refresh_token,user_info }  = await loginApi(params);
      // const { access_token, refresh_token } = res.data

      // 如果成功获取到 accessToken
      if (access_token) {
        // 将 accessToken 存储到 accessStore 中
        accessStore.setAccessToken(access_token);
        accessStore.setRefreshToken(refresh_token);

        // 获取用户信息并存储到 accessStore 中
        const [fetchUserInfoResult] = await Promise.all([
          fetchUserInfo(user_info),
        ]);
        userInfo = fetchUserInfoResult;
        userStore.setUserInfo(userInfo);
        // userInfo?.roles?.push(userInfo.roleId)
        // // const roles = []
        // // roles.push(userInfo?.roleId)
        // // userInfo?.roles=[userInfo?.roleId]
        // userStore.setUserInfo(userInfo)

        // userInfo = user_info;

        // userStore.setUserInfo("1122211221");
        accessStore.setAccessCodes(userInfo?.roles);

        if (accessStore.loginExpired) {
          accessStore.setLoginExpired(false);
        } else {
          let url = ''
          if (!['doctor'].includes(userInfo?.roleCode) ) {
            url = '/demos/admin'
          }else{
            onSuccess
            ? await onSuccess?.()
            : await router.push(userInfo.homePath || DEFAULT_HOME_PATH);
          }
          router.push({path:userStore.userInfo.homePath});
        }

        if (userInfo?.name) {
          notification.success({
            description: `${$t('authentication.loginSuccessDesc')}:${userInfo?.name}`,
            duration: 3,
            message: $t('authentication.loginSuccess'),
          });
        }
      }
    } finally {
      loginLoading.value = false;
    }

    return {
      userInfo,
    };
  }

  async function logout() {
    resetAllStores();
    accessStore.setLoginExpired(false);

    // 回登陆页带上当前路由地址
    await router.replace({
      path: LOGIN_PATH,
      query: {
        // redirect: encodeURIComponent(router.currentRoute.value.fullPath),
      },
    });
  }

  async function fetchUserInfo(userInfo :any) {
    // let userInfo: null | any = null;
    let userInfos = await getUserDetailAPI({userId:userInfo.id});

    const res = await getDictAllAPI()

    let url = ''
    if (!['doctor'].includes(userInfo?.roleCode) ) {
      url = '/demos/admin'
    }else{
      url = '/'
    }

    userInfos = {
     ...userInfos,
      roles: [],
      homePath: url,
    }
    userInfos.roles.push(userInfos.roleId,userInfos.roleCode,userInfos.isManager)
    userStore.setUserInfo(userInfos);
    userStore.setDict(res);
    return userInfos;
  }

  function $reset() {
    loginLoading.value = false;
  }


  return {
    $reset,
    authLogin,
    fetchUserInfo,
    loginLoading,
    logout,
  };
});
