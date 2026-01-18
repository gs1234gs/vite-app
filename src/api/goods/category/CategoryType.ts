import type { BasePojo } from "../../type/BasePojo";

export interface CategorySaveVO {
  /** 分类主键ID */
  id?: string; // 根据实际 API 返回决定，建议大数用 string

  /** 分类名称 */
  name?: string;

  /** 分类层级（如 1=一级分类，2=二级分类） */
  level?: number;

  /** 分类编码（用于快速检索或编码管理） */
  code?: string;

  /** 分类描述 */
  description?: string;

  /** 排序字段（越小越靠前） */
  sortOrder?: number;

  /** 分类图标（URL） */
  iconUrl?: string;

  /** 状态,是否启用（1=启用，0=禁用） */
  status?: number; // 0 或 1

  /** 是否为推荐分类（如首页展示）,(0 = 否，1表示是) */
  recommended?: number; // 0 或 1
}

// 分类 VO
export interface CategoryVO extends BasePojo {
  /** 分类主键ID */
  id: string; // BigInteger → string

  /** 分类名称 */
  name: string;

  /** 分类层级（如 1=一级分类，2=二级分类） */
  level: number;

  /** 分类编码（用于快速检索或编码管理） */
  code: string;

  /** 分类描述 */
  description: string;

  /** 排序字段（越小越靠前） */
  sortOrder: number;

  /** 分类图标（URL） */
  iconUrl: string;

  /** 状态：0=启用，1=禁用 */
  status: number;

  /** 是否为推荐分类：0=否，1=是 */
  recommended: number;
}