import type { BasePojo } from "../../type/BasePojo";

export interface ProductSaveVO {
  /** 商品id */
  id?: string;

  /** 商品名称 */
  name?: string;

  /** 商品价格 - 不应从前端传入 */
  price?: string;

  /** 商品描述 */
  description?: string;

  /** 商品图片 */
  image?: string;

  /** 视频 */
  video?: string;

  /** 品牌 */
  brand?: string;

  /** 产地 */
  placeOfOrigin?: string;

  /** 商品等级 */
  level?: number;

  /** 销量 */
  salesVolume?: number;

  /** 商品状态，0=下架，1=上架 */
  status?: number;

  /** 上架时间 */
  publishTime?: string;

  /** 下架时间 */
  offlineTime?: string;

  /** 分类 id */
  categoryId?: string[];

  /** 标签 id */
  tagId?: string[];
}

// ProductVO 扩展 BasePojo
export interface ProductVO extends BasePojo {
  /** 商品id */
  id: string;

  /** 商品名称 */
  name: string;

  /** 商品价格 */
  price: string;

  /** 商品描述 */
  description: string;

  /** 商品图片 */
  image: string;

  /** 视频 */
  video: string;

  /** 品牌 */
  brand: string;

  /** 产地 */
  placeOfOrigin: string;

  /** 商品等级 */
  level: number;

  /** 库存 */
  stock: number;

  /** 销量 */
  salesVolume: number;

  /** 商品状态，0=下架，1=上架 */
  status: 0 | 1;

  /** 上架时间 */
  publishTime: string;

  /** 下架时间 */
  offlineTime: string;

  /** 仓库id */
  warehouseId: string;

  /** 分类 id */
  categoryId: string[];
  /**
   * 分类名称
   */
  categoryName: string[];

  /** 标签 id */
  tagId: string[];

  /** 创建开始时间 */
  startTime: string;

  /** 创建结束时间 */
  endTime: string;
  // 最低价格
  minPrice:string;
  //最高价格
  maxPrice:string
}