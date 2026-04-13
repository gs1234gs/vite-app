export interface TenantType {
  id?: string;
  name?: string;
  description?: string;
  creator?: string;
  updater?: string;
  createTime?: string;
  updateTime?: string;
  delFlag?: number;
}

export interface PageTenantCondition {
  name?: string;
}

export interface TenantSaveType {
  name?: string;
  description?: string;
}
