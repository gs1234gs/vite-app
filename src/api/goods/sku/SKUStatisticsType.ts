import type { BasePojo } from "../../type/BasePojo";

// SKU统计概览VO（简化版，时间维度统计由采购订单完成）
export interface SkuStatisticsVO {
  // 总销量
  totalSales: number;
  // 商品总数
  totalStock: number;
  // 低库存总量
  totalLow: number;
  // 总营收
  totalRevenue: string;
  // 总价值
  totalValue: string;
  // 总销售额
  totalVolume: string;
}

// SKU基础信息（用于排行榜和预警）
export interface SKURankingVO extends BasePojo {
  id: string;
  name: string;
  skuCode: string;
  price: string;
  costPrice: string | null;
  stock: number;
  salesVolume: number;
  status: number;
  productId: string;
  productName?: string;
  picList?: string[];
}
