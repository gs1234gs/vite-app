import type { Dayjs } from "dayjs";
import type { BasePojo } from "../../type/BasePojo";

// SKU 保存/提交用 VO（用于新增或更新 SKU）
export interface SKUSaveVO {
  picList: string[];
  id?: string;               // BigInteger -> string
  name?: string;
  skuCode?: string;
  price?: string;            // BigDecimal -> string
  costPrice?: string | null;
  stock?: number;
  addStock?: any;
  salesVolume?: number;
  status?: number;           // 0=上架，1=下架（后端定义）
  weight?: string;           // BigDecimal -> string
  sort?: number;
  publishTime?: any;
  offlineTime?: any ;
  detailContent?: any;
  productId: string;         // BigInteger -> string
}

export interface SKUVO {
  id: string;                // BigInteger -> string
  name: string;
  skuCode: string;
  price: string;             // BigDecimal -> string
  costPrice: string | null;
  stock: number;
  addStock: any;
  salesVolume: number;
  status: number;            // 0=上架，1=下架
  weight: string;
  sort: number;
  publishTime?: any;
  offlineTime?: any;
  detailContent: any;
  productId: string;         // BigInteger -> string
  picList: string[];
}

export interface SKUGroupByProductIdVO {
  productId: string;
  productName: string;
  skuList: SKUVO[];
}
