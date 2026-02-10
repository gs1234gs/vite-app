import type { BasePojo } from "../../type/BasePojo";

/**
 * 标签保存/提交用 VO（用于新增或编辑标签）
 */
export interface TagSaveVO {
  /**
   * 标签 ID（编辑时存在，新增时可为空）
   */
  id?: string;

  /**
   * 标签名称
   */
  name?: string;

  /**
   * 标签编码（英文或拼音，方便系统使用）
   */
  code?: string;

  /**
   * 标签颜色（用于前端展示，例如 "#FF9900"）
   */
  color?: string;

  /**
   * 状态：1 = 启用，0 = 禁用
   */
  status?: 0 | 1;

  /**
   * 标签权重（用于推荐优先级或排序，字符串形式以保证精度）
   */
  weight?: string;

  /**
   * 排序值（越小越靠前）
   */
  sort?: number;

  /**
   * 材料组成
   */
  composition?: string;

  /**
   * 产地
   */
  placeOfOrigin?: string;

  /**
   * 重量（字符串形式，如 "0.500"，单位由业务约定）
   */
  productWeight?: string;

  /**
   * 生产日期（ISO 8601 格式字符串，如 "2025-12-20" 或 "2025-12-20T00:00:00"）
   */
  productionDate?: string;

  /**
   * 保质期，单位：天
   */
  shelfLife?: number;

  /**
   * 标签描述
   */
  description?: string;
}


// TagVO：用于展示的标签视图对象
export interface TagVO extends BasePojo {
  /** 标签主键 ID */
  id: string;

  /** 标签名称 */
  name: string;

  /** 标签编码（英文或拼音，方便系统使用） */
  code: string;

  /** 标签颜色（用于前端展示，例如 "#FF9900"） */
  color: string;

  /** 状态：1=启用，0=禁用 */
  status: 0 | 1;

  /** 标签权重（用于推荐优先级或排序，字符串形式） */
  weight: string;

  /** 排序值（越小越靠前） */
  sort: number;

  /** 材料组成 */
  composition: string;

  /** 产地 */
  placeOfOrigin: string;

  /** 重量（字符串形式，单位由业务约定，如 kg/g） */
  productWeight: string;

  /** 生产日期（ISO 8601 格式字符串） */
  productionDate: string;

  /** 保质期，单位：天 */
  shelfLife: number;

  /** 标签描述 */
  description: string;
}

