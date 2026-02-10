import type { BasePojo } from "@/api/type/BasePojo";
import type { OrderAddressVO } from "../address/OrderAddressType";
import type { SKUVO } from "@/api/goods/sku/SKUType";
import type { TagVO } from "@/api/goods/tag/TagType";

/**
 * 采购订单保存/提交 VO（用于创建或更新订单）
 */
export interface PurChaseOrderSaveVO {
  /**
   * 订单 ID（编辑时存在，新增时可为空）
   */
  id?: string;

  /**
   * 订单编号（通常由系统生成，前端一般不传）
   */
  orderNo?: string;

  /**
   * 订单状态：
   * 1=待付款, 2=待发货, 3=待收货, 4=待评价, 5=已完成, 6=已取消
   */
  status?: 1 | 2 | 3 | 4 | 5 | 6;

  /**
   * 付款状态：1=未付款, 2=已付款
   */
  payStatus?: 1 | 2;

  /**
   * 收货状态：1=未收货, 2=已收货
   */
  receiveStatus?: 1 | 2;

  /**
   * 订单总金额（字符串形式，如 "299.90"）
   */
  amount?: string;

  /**
   * 支付时间（ISO 8601 字符串）
   */
  payTime?: string;

  /**
   * 下单时间
   */
  orderPlacementTime?: string;

  /**
   * 商品 SKU ID
   */
  skuId?: string;

  /**
   * 付款方式：
   * "1"=在线支付, "2"=货到付款, "3"=其他
   */
  payType?: '1' | '2' | '3';

  /**
   * 配送费用（单位：分 or 元？由业务决定，但以字符串传输，避免精度丢失）
   */
  deliveryFee?: string;

  /**
   * 配送方式（如 "顺丰快递", "自提"）
   */
  delivery?: string;

  /**
   * 实付金额（字符串形式）
   */
  payAmount?: string;

  /**
   * 订单备注
   */
  remark?: string;

  /**
   * 商品数量
   */
  num?: number;

  /**
   * 收货地址 ID（关键！不是整个地址对象）
   */
  addressId?: string;
  //商品id
  productId:string
}

/**
 * 采购订单详情 VO（用于前端展示）
 */
export interface PurChaseOrderVO extends BasePojo {
  /** 订单主键 ID */
  id: string;

  /** 订单编号（系统生成，如 PO20251220001） */
  orderNo: string;

  /**
   * 订单状态：
   * 1=待付款, 2=待发货, 3=待收货, 4=待评价, 5=已完成, 6=已取消
   */
  status: 1 | 2 | 3 | 4 | 5 | 6;

  /** 付款状态：1=未付款, 2=已付款 */
  payStatus: 1 | 2;

  /** 收货状态：1=未收货, 2=已收货 */
  receiveStatus: 1 | 2;

  /** 订单总金额（字符串形式） */
  amount: string;

  /** 支付时间（ISO 8601，可能为 null） */
  payTime: string | null;

  /** 下单时间 */
  orderPlacementTime: string;

  /** 商品 SKU ID */
  skuId: string;

  /**
   * 付款方式：
   * "1"=在线支付, "2"=货到付款, "3"=其他
   */
  payType: '1' | '2' | '3';

  /** 配送费用（字符串形式） */
  deliveryFee: string;

  /** 配送方式 */
  delivery: string;

  /** 实付金额（字符串形式） */
  payAmount: string;

  /** 订单备注 */
  remark: string;

  /** 商品数量 */
  num: number;

  /** 收货地址信息（嵌套对象） */
  orderAddressVO: OrderAddressVO;
  //订单名称
  name:string;
  image:string
}


export interface PurchaseOrderDetailVO extends BasePojo {
  id: string;
  orderNo: string;
  status: 1 | 2 | 3 | 4 | 5 | 6;
  payStatus: 1 | 2;
  receiveStatus: 1 | 2;
  amount: string;
  payTime: string | null;
  orderPlacementTime: string;
  skuId: string;
  payType: '1' | '2' | '3';
  deliveryFee: string;
  delivery: string;
  payAmount: string;
  remark: string;
  num: number;
  orderAddressVO: OrderAddressVO;
  name: string;
  sku: SKUVO;
  tag: TagVO[];
}

export interface PurchaseOrderSearchVO {
  startTime?: string; // ISO 或 'yyyy-MM-dd HH:mm:ss'
  endTime?: string;
  payStatus?: number;
}