import type { SKUVO } from "../sku/SKUType";
import type { TagVO } from "../tag/TagType";

/**
 * 商品搜索保存参数 VO（用于前端传参或保存搜索条件）
 */
export interface ProductSearchSaveVO {
  /**
   * 商品最低价格（字符串形式，避免精度丢失）
   */
  minPrice?: string;

  /**
   * 商品最高价格（字符串形式）
   */
  maxPrice?: string;

  /**
   * 分类 ID（字符串形式，对应 Java BigInteger）
   */
  categoryId?: string;

  /**
   * 搜索内容（关键词，如商品名称、描述等）
   */
  searchContent?: string;
}




export interface ProductCustomerVO {
  /** 商品ID */
  id: string;

  /** 商品名称 */
  name: string;

  /** 商品原价（字符串形式，如 "99.99"） */
  originalPrice: string;

  /** 商品优惠后价格（字符串形式） */
  discountPrice: string;

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

  /** 商品等级（具体含义由业务定义） */
  level: number; // short → number，若等级固定可改为 1 | 2 | 3...

  /** 库存 */
  stock: number;

  /** 销量 */
  salesVolume: number;

  /** 商品状态：0=下架，1=上架，2=预发布 */
  status: 0 | 1 | 2;

  /** 上架时间（ISO 8601 格式字符串） */
  publishTime: string;

  /** 下架时间 */
  offlineTime: string;

  /** 标签 ID */
  tagName: string;
  /** 最低价格（字符串形式） */
  minPrice: string;

  /** 最高价格（字符串形式） */
  maxPrice: string;
}


/**
 * 商品详情（面向客户展示）VO
 */
export interface ProductCustomerDetailVO {
  /** 商品ID */
  id: string;

  /** 商品名称 */
  name: string;

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

  /** 商品状态：0=下架，1=上架，2=预发布 */
  status: 0 | 1 | 2;

  /** 上架时间（ISO 8601 字符串） */
  publishTime: string;

  /** 下架时间 */
  offlineTime: string;

  /** 最低价格（字符串形式，如 "29.90"） */
  minPrice: string;

  /** 最高价格（字符串形式） */
  maxPrice: string;

  /** SKU 列表 */
  skuList: SKUVO[];

  /** 标签列表 */
  tagList: TagVO[];
  discountPrice:string
}