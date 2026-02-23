// product-carousal.model.ts

import type { BasePojo } from "@/api/type/BasePojo";

/**
 * 轮播图保存/提交 DTO（对应 ProductCarousalSaveVO）
 */
export interface ProductCarousalSaveVO {
  id?: string;
  /** 轮播标题 */
  title: string;
  /** 图片路径（URL） */
  image: string;
  /** 轮播链接（跳转地址） */
  link: string;
  /** 轮播顺序（数值越小越靠前） */
  sort: number;
  /** 是否显示：0=不显示，1=显示 */
  status: 0 | 1;
  /** 描述 */
  description?: string;
     //类型，1登录页轮播图，2商品详情轮播图
   type: number;
}

/**
 * 轮播图查询响应 VO（对应 ProductCarousalVO）
 * 注意：Java 的 BigInteger 在 TS 中必须用 string 表示（避免 JS Number 精度丢失）
 */
export interface ProductCarousalVO extends BasePojo{
  id: string; //
  title: string;
  image: string;
  link: string;
  sort: number;
  status: 0 | 1;
  description?: string;
      //类型，1登录页轮播图，2商品详情轮播图
   type: number;
}