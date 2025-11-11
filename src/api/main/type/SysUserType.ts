export interface SysUserType {
  id?: string;
  deptId?: number;
  username?: string;
  nickName?: string;
  type?: number; // 或自定义用户类型枚举
  email?: string;
  phoneNumber?: string;
  idCard?: string;
  gender?: number;
  image?: string;
  password?: string;
  status?: number;
  delFlag?: number;
  loginTime?: string;
  createTime?: string;
  creatorId?: number;
  updaterId?: number;
  updateTime?: string;
  remark?: string;
  roleIdList?:[]
}