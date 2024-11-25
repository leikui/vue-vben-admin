import { requestClient } from '#/api/request';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    password: string;
    username: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    accessToken: string;
    desc: string;
    realName: string;
    refreshToken: string;
    userId: string;
    username: string;
  }
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<any>('/oauth2/token', data,data);
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return requestClient.get<string[]>('/auth/codes');
}

/**
 * 获取用户权限码
 */
export async function getDockerUnits() {
  return requestClient.get<string[]>('/doctor/queryUnits');
}

/** get 请求 */
export const getAllUnitAPI = (param: any) => {
  return requestClient.get<any>('/unit/unitList', param)
}

export async function addDoctorUnits(data) {
  return requestClient.post<any>('/doctor/addDoctorUnits', data);
}
export async function deletedoctorUnits(data) {
  return requestClient.post<any>('/doctor/deletedoctorUnits', data);
}


/** get 请求 */
export const getRolesListAPI = (param: any) => {
  return requestClient.get<any>('/center/user/roles', param)
}
export const addRolesAPI = (param: any) => {
  return requestClient.post<any>('/center/user/roles/saveOrUpdate', param)
}

/** get 请求 */
export const delRolesAPI = (param: any) => {
  return requestClient.get<any>('/center/user/deleteRolesById', param)
}


export const addUserRolesAPI = (param: any) => {
  return requestClient.post<any>('/center/user/addRolesToUser', param)
}
