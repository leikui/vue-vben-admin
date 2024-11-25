import { acceptHMRUpdate, defineStore } from 'pinia';

interface BasicUserInfo {
  /**
   * 头像
   */
  avatar: string;
  /**
   * 用户昵称
   */
  realName: string;
  /**
   * 用户角色
   */
  roles?: string[];
  /**
   * 用户id
   */
  userId: string;
  /**
   * 用户名
   */
  username: string;
}

interface AccessState {
  /**
   * 用户信息
   */
  userInfo: any | null;
  /**
   * 用户角色
   */
  userRoles: string[];
  dict: [],
  doctorUnits:[],
  checkedDoctorUnitId:string,
}
/**
 * @zh_CN 用户信息相关
 */
export const useUserStore = defineStore('core-user', {
  actions: {
    setUserInfo(userInfo: any | null) {
      // 设置用户信息
      this.userInfo = userInfo;
      // 设置角色信息
      const roles = userInfo?.roles ?? [];
      console.log(roles);

      this.setUserRoles(roles);
    },
    setUserRoles(roles: string[]) {
      this.userRoles = roles;
    },
    setDict(dicts :any) {
      this.dict = dicts;
    },
    setDoctorUnits(doctorUnits :any) {
      this.doctorUnits = doctorUnits;
    },
    setCheckedDoctorUnitId(checkedDoctorUnitId :any) {
      this.checkedDoctorUnitId = checkedDoctorUnitId;
    },
  },
  state: (): AccessState => ({
    userInfo: null,
    userRoles: [],
    dict:[],
    doctorUnits:[],
    checkedDoctorUnitId:''
  }),
  persist: {
    // 持久化
    paths: ['userInfo','dict','userRoles','doctorUnits','checkedDoctorUnitId'],
  },
});

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useUserStore, hot));
}
