
export interface OrderAddressVO{
    //地址id
   id:number;
   //收货人姓名
   name:string;
   //收货人电话
   phone:string;
   //收货人地址
   address:string;
   //备注
   description:string

}

export interface PurChaseOrderVO{
     //订单id
    id:string;
        //订单编号
    orderNo:string;
    // //订单状态，1-待付款，2-待发货，3-待收货，4-待评价，5-已完成，6-已取消
    status:number;
    //付款状态，1-未付款，2-已付款
    payStatus:number;
    //收货状态，1-未收货，2-已收货
    receiveStatus:number;
    //订单金额
    amount:string;
        //支付时间
    payTime:string
       //下单时间
    orderPlacementTime:string
     //商品id
      skuId:string
      //付款方式，1-在线支付，2-货到付款，3-其他
      payType:number
      //配送费用
      deliveryFee:string
       //配送方式
      delivery:string
        //实付金额
      payAmount:string
      //订单备注
      remark:string
      num:number
}