import type { ProductApiVO, CategoryApiVO, SKUApiVO, TagApiVO } from "@/api/goods/typeapi/ProductApiType";

/**
 * 用户收藏记录详情（用于查询返回）
 */
export interface UserCollectVO {
  id: string;                     // 收藏记录 ID
  product: ProductApiVO;          // 收藏的商品详情
  collectTime: string;            // 收藏时间 (ISO 8601)
  categoryList: CategoryApiVO[];  // 所属分类列表
  skuList: SKUApiVO[];            // 关联 SKU 列表
  tagList: TagApiVO[];            // 关联标签列表
}

/**
 * 用户收藏保存请求体（用于新增/更新）
 */
export interface UserCollectSaveVO {
  id?: string;                    // 可选，编辑时传入
  product: ProductApiVO;          // 商品信息（⚠️ 建议改为 productId）
  collectTime: string;            // 收藏时间
}