// 基础 POJO 字段
export interface BasePojo {
  /** 创建者，SysUser 的 ID */
  creator: string; // BigInteger → string

  /** 更新者，SysUser 的 ID */
  updater: string; // BigInteger → string

  /** 创建时间，ISO 8601 格式字符串 */
  createTime: string; // LocalDateTime → string

  /** 最后更新时间，ISO 8601 格式字符串 */
  updateTime: string; // LocalDateTime → string

  /** 删除标记：0 - 未删除，1 - 已删除 */
  delFlag: number;
}