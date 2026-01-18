import type { BasePojo } from "../../type/BasePojo";

export interface OrderAddressSaveVO{
    //地址id
   id:string;
   //收货人姓名
   name:string;
   //收货人电话
   phone:string;
   //收货人地址
   address:string;
   //备注
   description:string

}
/**
 * 订单收货地址 VO
 */
export interface OrderAddressVO extends BasePojo {
  /** 地址主键 ID */
  id: string;

  /** 详细地址 */
  address: string;

  /** 联系电话 */
  phone: string;

  /** 联系人姓名 */
  name: string;

  /** 描述（如“公司前台”、“小区南门代收”等） */
  description: string;
}

