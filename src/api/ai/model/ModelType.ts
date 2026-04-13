import type { BasePojo } from "../../type/BasePojo";

/**
 * 大模型 VO（包含审计字段）
 */
export interface BigModelVO extends BasePojo {
  /** 大模型 ID */
  id: string;
  
  /** 大模型名称 */
  name: string;
  
  /** 大模型类型 */
  type: number;
  
  /** 状态：0=启用，1=禁用 */
  status: number;
  
  /** 大模型描述 */
  description?: string;
  
  /** 大模型版本 */
  version?: string;
}

/**
 * 大模型保存 VO（用于新增/编辑）
 */
export interface BigModelSaveVO {
  /** 大模型 ID（编辑时必填） */
  id?: string;
  
  /** 大模型名称 */
  name: string;
  
  /** 大模型类型 */
  type: number;
  
  /** 状态：0=启用，1=禁用 */
  status?: number;
  
  /** 大模型描述 */
  description?: string;
  
  /** 大模型版本 */
  version?: string;
}

/**
 * 大模型分页查询条件 VO
 */
export interface BigModelPageVO {
  /** 名称（模糊查询） */
  name?: string;
  
  /** 类型 */
  type?: number;
  
  /** 状态 */
  status?: number;
}
