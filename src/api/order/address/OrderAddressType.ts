import type { BasePojo } from "../../type/BasePojo";

/**
 * 订单收货地址保存VO
 */
export interface OrderAddressSaveVO {
  /** 地址ID(编辑时传入) */
  id?: number;
  /** 联系人姓名 */
  name: string;
  /** 联系电话 */
  phone: string;
  /** 详细地址 */
  address: string;
  /** 备注描述 */
  description?: string;
}

/**
 * 订单收货地址 VO
 */
export interface OrderAddressVO extends BasePojo {
  /** 地址主键 ID */
  id: number;

  /** 详细地址 */
  address: string;

  /** 联系电话 */
  phone: string;

  /** 联系人姓名 */
  name: string;

  /** 描述（如"公司前台"、"小区南门代收"等） */
  description?: string;
}
