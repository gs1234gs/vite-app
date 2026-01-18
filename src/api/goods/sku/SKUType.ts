import type { BasePojo } from "../../type/BasePojo";

/**
 * SKU 保存/提交用 VO（用于新增或更新 SKU）
 */
export interface SKUSaveVO {
  /**
   * SKU 主键 ID（编辑时存在，新增时可为空）
   */
  id?: string;

  /**
   * 名称
   */
  name?: string;

  /**
   * 商品编码（内部唯一编码）
   */
  skuCode?: string;

  /**
   * 销售价（字符串形式，避免精度丢失）
   */
  price?: string;

  /**
   * 成本价（可选，字符串形式）
   */
  costPrice?: string;

  /**
   * 当前库存数量
   */
  stock?: number;

  /**
   * 要添加的库存（用于增量更新）
   */
  addStock?: number;

  /**
   * 销售量
   */
  salesVolume?: number;

  /**
   * 状态：0 = 下架，1 = 上架
   */
  status?: number;

  /**
   * 权重（用于推荐、排序，字符串形式）
   */
  weight?: string;

  /**
   * 排序值（越小越靠前）
   */
  sort?: number;

  /**
   * 上架时间（ISO 8601 格式字符串，如 "2025-12-20T10:00:00"）
   */
  publishTime?: string;

  /**
   * 下架时间
   */
  offlineTime?: string;

  /**
   * 商品详情（富文本内容等）
   */
  detailContent?: string;
  //商品id
  productId: string ;
}

// SKUVO：用于展示或返回的 SKU 视图对象
export interface SKUVO extends BasePojo {
  /** SKU 主键 ID */
  id: string;

  /** 名称 */
  name: string;

  /** 商品编码（内部唯一编码） */
  skuCode: string;

  /** 销售价（字符串形式，如 "299.99"） */
  price: string;

  /** 成本价（可选，字符串形式） */
  costPrice: string | null; // 若后端可能返回 null

  /** 库存数量 */
  stock: number;

  /** 要添加的库存（注意：此字段通常用于保存请求，在 VO 中较少见，但保留） */
  addStock: number | null;

  /** 销售量 */
  salesVolume: number;

  /** 状态：0=下架，1=上架 */
  status: number;

  /** 权重（用于推荐、排序，字符串形式） */
  weight: string;

  /** 排序值（越小越靠前） */
  sort: number;

  /** 上架时间（ISO 8601） */
  publishTime: string | null;

  /** 下架时间（ISO 8601） */
  offlineTime: string | null;

  /** 商品详情（富文本等） */
  detailContent: string | null;
  //商品id
  productId: string ;
}

export interface SKUGroupByProductIdVO{
  productId:string,
  productName:string,
  skuList: Array<SKUVO>
}