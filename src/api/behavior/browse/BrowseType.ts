import type { CategoryApiVO, ProductApiVO, SKUApiVO, TagApiVO } from "@/api/goods/typeapi/ProductApiType";

/**
 * 用户浏览记录详情（用于查询返回）
 */
export interface UserBrowseVO {
  id: string;                          // 主键 ID
  product: ProductApiVO;               // 关联商品
  browseStartTime: string;             // 浏览开始时间 (ISO string)
  browseEndTime: string | null;        // 浏览结束时间
  ipAddress: string;                   // IP 地址
  deviceType: string;                  // 设备类型（如 "mobile", "pc"）
  browseDuration: string;              // 浏览时长（毫秒，BigInteger → string）
  categoryList: CategoryApiVO[];       // 分类列表
  skuList: SKUApiVO[];                 // SKU 列表
  tagList: TagApiVO[];                 // 标签列表
}

/**
 * 用户浏览记录保存请求体（用于提交）
 */
export interface UserBrowseSaveVO {
  id?: string;                         // 可选，编辑时传入
  product: ProductApiVO;               // 商品信息（注意：实际业务中可能只需 productId）
  browseStartTime: string;             // 开始时间
  browseEndTime: string | null;        // 结束时间
  ipAddress: string;                   // IP
  deviceType: string;                  // 设备类型
  browseDuration: string;              // 时长（毫秒，字符串形式）
}