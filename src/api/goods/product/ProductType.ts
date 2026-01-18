import type { BasePojo } from "../../type/BasePojo";

export interface ProductSaveVO {
  /** 商品ID（编辑时存在，新增时可为空） */
  id?: string;

  /** 商品名称 */
  name?: string;

  /** 商品价格（字符串形式，避免精度丢失） */
  price?: string;

  /** 商品描述 */
  description?: string;

  /** 商品图片（URL） */
  image?: string;

  /** 视频（URL） */
  video?: string;

  /** 品牌 */
  brand?: string;

  /** 产地 */
  placeOfOrigin?: string;

  /** 商品等级（由业务定义，如 1=普通, 2=优质等） */
  level?: number; // short → number

  /** 库存 */
  stock?: number;

  /** 销量（通常保存时不传，但保留字段） */
  salesVolume?: number;

  /** 商品状态：0=下架，1=上架 */
  status?: number;

  /** 上架时间（ISO 8601 字符串，如 "2025-12-20T10:00:00"） */
  publishTime?: string;

  /** 下架时间 */
  offlineTime?: string;

  /** 仓库ID列表 */
  warehouseId?: string[];

  /** 分类ID列表 */
  categoryId?: string[];

  /** 标签ID列表 */
  tagId?: string[];

  /** SKU ID 列表（注意：这里 Java 是 List<BigInteger> skuList，表示 SKU 的 ID 列表） */
  skuList?: string[];
}

// ProductVO 扩展 BasePojo
export interface ProductVO extends BasePojo {
  /** 商品ID */
  id: string;

  /** 商品名称 */
  name: string;

  /** 商品价格（字符串形式，如 "99.99"） */
  price: string;

  /** 商品描述 */
  description: string;

  /** 商品图片（URL） */
  image: string;

  /** 视频（URL） */
  video: string;

  /** 品牌 */
  brand: string;

  /** 产地 */
  placeOfOrigin: string;

  /** 商品等级（业务自定义，如 1=普通, 2=优质） */
  level: number; // 或具体字面量如 1 | 2 | 3

  /** 库存 */
  stock: number;

  /** 销量 */
  salesVolume: number;

  /** 商品状态：0=下架，1=上架 */
  status: 0 | 1;

  /** 上架时间 */
  publishTime: string; // ISO 8601

  /** 下架时间 */
  offlineTime: string; // ISO 8601

  /** 仓库ID */
  warehouseId: string;

  /** 分类ID列表 */
  categoryId: string[];

  /** 标签ID列表 */
  tagId: string[];

  /** 创建开始时间（用于查询条件，但出现在 VO 中，保留） */
  startTime: string; // ISO 8601

  /** 创建结束时间 */
  endTime: string; // ISO 8601
}