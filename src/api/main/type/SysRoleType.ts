export interface SysRoleType {
  /** 角色id */
  id?: string; // BigInteger → string

  /** 角色名称 */
  name?: string;

  /** 角色权限标识 */
  roleKey?: string;

  /** 角色排序 */
  sort?: number;

  /** 数据范围（1：所有数据权限，2：自定义，3：本部门，4：本部门及以下，5：仅本人） */
  dataScope?: number;

  /** 菜单树是否父子关联（0：否，1：是） */
  menuCheckStrictly?: number;

  /** 部门树是否父子关联（0：否，1：是） */
  deptCheckStrictly?: number;

  /** 角色状态（1：停用，0：启用） */
  status?: number;

  /** 删除标志（1：删除，0：未删除） */
  delFlag?: number;

  /** 创建者id */
  creator?: string; // BigInteger → string

  /** 创建时间 */
  createTime?: string; // LocalDateTime → string

  /** 更新者id */
  updater?: string; // BigInteger → string

  /** 更新时间 */
  updateTime?: string; // LocalDateTime → string

  /** 备注 */
  remark?: string;
  menuIds?:[]
}
