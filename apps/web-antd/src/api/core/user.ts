import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  return requestClient.get<UserInfo>('/user/info');
}


/**
 * 获取用户信息
 */
export async function getDoctorInfoAPI() {
  return requestClient.get<any>('/user/doctor/info');
}




/**
 * 获取用户权限码
 */
export async function getAllUserAPI(param :any) {
  return requestClient.get<any>('/doctor/allUsers',param,);
}

/**
 * 获取用户权限码
 */
export async function getAllHisUserAPI(param :any) {
  return requestClient.get<any>('/doctor/allHisUsers',param,);
}
/**
 * 获取用户详情
 */
export async function getAllUserDetailAPI(param :any) {
  return requestClient.get<any>('/doctor/userDetail',param);
}


/**
 * 获取用户详情
 */
export async function completeUserAPI(param :any) {
  return requestClient.post<any>('/user/endUser',param);
}


/**
 * 修改密码
 */
export async function chagepwdAPI(param :any) {
  return requestClient.put<any>('/user/password',param);
}


/**
 * 修改密码
 */
export async function getUserMsgAPI(param :any) {
  return requestClient.get<any>('/message/web/findUserMessage',param);
}



/**
 * 获取字典
 */
export async function getDictAllAPI(param? :any) {
  return requestClient.get<any>('/dict/all',param);
}


/**
 * 查看用户详情
 */
export async function getUserDetailAPI(param? :any) {
  return requestClient.get<any>('/user/getPepInfo',param);
}



/**
 * 医生查看患者列表
 */
export async function getDoctorUserslAPI(param? :any) {
  return requestClient.get<any>('/doctor/users',param);
}




/**
 * 医生绑定患者列表
 */
export async function addDoctorUserslAPI(param? :any) {
  return requestClient.post<any>('/doctor/add_user',param);
}


/**
 * 上传文件
 */
export async function upLoadFileAPI(param: File) {
  return requestClient.upload('/file/upload',{file:param});
}





/**
 * 查询医生设备列表
 */
export async function getDoctorDevicelAPI(param? :any) {
  return requestClient.get<any>('/equipments/page',param);
}

/**
 * 医生上报工单
 */
export async function addDoctorOrderAPI(param? :any) {
  return requestClient.post<any>('/equipments/addOrder',param);
}


/**
 * 查询医生设备历史工单
 */
export async function getDevicelOrderAPI(param? :any) {
  return requestClient.get<any>('/equipments/historyOrders',param);
}

/**
 * 医生解绑设备
 */
export async function doctorUnDeviceAPI(param? :any) {
  return requestClient.post<any>('/equipments/del',param);
}


/**
 * 查询聊天医嘱
 */
export async function getDoctorAdviceAPI(param? :any) {
  return requestClient.get<any>('/doctor/queryYiZhu',param);
}


/**
 * 查询小孩信息
 */
export async function getChildInfoAPI(param? :any) {
  return requestClient.get<any>('/doctor/childInfo',param);
}


/**
 * 医生添加医嘱
 */
export async function doctorAddDeviceAPI(param? :any) {
  return requestClient.post<any>('/doctor/addYiZhu',param);
}


/**
 * 查询医生小孩病例
 */
export async function getChildBlAPI(param? :any) {
  return requestClient.get<any>('/doctor/queryBingLi',param);
}


/**
 * 添加医生小孩病例
 */
export async function addChildBlAPI(param? :any) {
  return requestClient.post<any>('/doctor/addBingli',param);
}

/**
 * 查询医生测力患者
 */
export async function getDoctorhzAPI(param? :any) {
  return requestClient.get<any>('/doctor/signUser',param);
}
/**
 * 查询医生测力患者
 */
export async function getDoctorhzedAPI(param? :any) {
  return requestClient.get<any>('/doctor/signedUser',param);
}


/**
 * 置顶用户
 */
export async function addMsg2TopAPI(param? :any) {
  return requestClient.post<any>('/doctor/topOrCancelUser',param);
}


/**
 * 修改训练类型
 */
export async function updateXlTypeAPI(param? :any) {
  return requestClient.post<any>('/doctor/update/childInfo',param);
}



/**
 * 发送消息
 */
export async function sendMsgAPI(param? :any) {
  return requestClient.post<any>('/message/sendMessage',param);
}

/**
 * 消息记录
 */
export async function msgRecodeAPI(param? :any) {
  return requestClient.get<any>('/message/findMessageBySendUserAndReceiveUser',param);
}



/**
 * 查询审核消息
 */
export async function getApprovalMsgAPI(param? :any) {
  return requestClient.get<any>('/admin/adj/unRead',param);
}

/**
 * 单位审核
 */
export async function approvalUnitAPI(param? :any) {
  return requestClient.post<any>('/admin/adjUnit',param);
}

/** get训练记录 请求 */
export const getHisAPI = (param: any) => {
  return requestClient.get<any>('/user/train/child', param)
}
