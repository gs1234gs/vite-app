import type { ProductApiVO, CategoryApiVO, SKUApiVO, TagApiVO } from "@/api/goods/typeapi/ProductApiType";

/**
 * 用户点击记录详情（用于查询返回）
 */
export interface UserClickVO {
  id: string;                     // 主键 ID
  clickTime: string;              // 点击时间 (ISO 8601)
  tagId: string;                  // 点击的标签 ID
  product: ProductApiVO;          // 关联商品
  categoryList: CategoryApiVO[];  // 分类列表
  skuList: SKUApiVO[];            // SKU 列表
  tagList: TagApiVO[];            // 标签列表
}

/**
 * 用户点击记录保存请求体（用于提交）
 */
export interface UserClickSaveVO {
  id?: string;                    // 可选，编辑时使用
  clickTime: string;              // 点击时间
  tagId: string;                  // 被点击的标签 ID
  product: ProductApiVO;          // 商品信息（注意：实际建议只传 productId）
}