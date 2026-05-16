import type { Dayjs } from "dayjs";
import type { BasePojo } from "../../type/BasePojo";
import type { WarehouseVO } from "../warehouse/WarehouseType";

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
  warehouseIds?: string[];   // 仓库 ID 列表
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
  warehouseList?: WarehouseVO[]; // 仓库列表对象（用于显示和回显）
}

export interface SKUGroupByProductIdVO {
  productId: string;
  productName: string;
  skuList: SKUVO[];
}
