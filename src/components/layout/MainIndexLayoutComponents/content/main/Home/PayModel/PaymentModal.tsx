import React, { useState } from 'react';
import {
  Modal,
  Radio,
  Button,
  message,
  Spin,
  Space,
  Typography,
  Divider,
} from 'antd';
import { CreditCardOutlined, AlipayCircleOutlined, WechatOutlined } from '@ant-design/icons';
import type { SKUVO } from '@/api/goods/sku/SKUType';
import usePurChaseOrder from '@/stores/order/PurchaseOrder';
import type { PurChaseOrderSaveVO } from '@/api/order/order/OrderType';

const { Text, Title } = Typography;

interface PaymentModalProps {
  visible: boolean;
  sku: SKUVO | null;
  productId: string;
  onClose: () => void;
  onPurchaseSuccess: () => void; // 通知商品详情页关闭并刷新
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  sku,
  productId,
  onClose,
  onPurchaseSuccess,
}) => {
  const { saveApi, loading } = usePurChaseOrder();
  const [payType, setPayType] = useState<'1' | '2' | '3'>('1'); // 默认在线支付
  const [isPaying, setIsPaying] = useState(false);

  const handleConfirmPay = async () => {
    if (!sku) {
      message.warning('商品信息异常，请重试');
      return;
    }

    setIsPaying(true);

    try {
      // 构造订单数据（地址暂时为 null，按你要求）
      const orderData = {
        skuId: sku.id,
        num: 1,
        amount: sku.price, // 订单总金额
        payAmount: sku.price, // 实付金额
        payType: payType,
        status: 1, // 待付款
        payStatus: payType === '1' ? 2 : 1, // 若在线支付，模拟已付款；否则未付
        receiveStatus: 1, // 未收货
        deliveryFee: '0', // 暂定免运费
        delivery: '快递配送',
        remark: '',
        addressId: undefined, // 按你要求，地址暂为 undefined
        orderPlacementTime: new Date().toISOString(),
        payTime: payType === '1' ? new Date().toISOString() : undefined,
         productId: productId,
      } as PurChaseOrderSaveVO;

      const orderId = await saveApi(orderData);
      if (orderId) {
        message.success('✅ 购买成功！订单已创建');
        onPurchaseSuccess(); // 关闭商品详情弹窗
        onClose(); // 关闭支付弹窗
      }
    } catch (err) {
      message.error('下单失败，请稍后重试');
    } finally {
      setIsPaying(false);
    }
  };

  const totalAmount = sku?.price || '0.00';

  return (
    <Modal
      title={
        <Title level={4} style={{ margin: 0 }}>
          确认支付
        </Title>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
      destroyOnClose
      maskClosable={false}
    >
      {sku ? (
        <>
          {/* 商品摘要 */}
          <div style={{ marginBottom: 24 }}>
            <Text strong>商品：</Text>
            <Text>{sku.name}</Text>
            <br />
            <Text strong>数量：</Text>
            <Text>1 件</Text>
            <br />
            <Text strong>单价：</Text>
            <Text>¥{sku.price}</Text>
          </div>

          <Divider />

          {/* 支付金额 */}
          <div style={{ textAlign: 'right', marginBottom: 24 }}>
            <Text type="secondary">合计：</Text>
            <Text strong style={{ fontSize: 20, color: '#cf1322' }}>
              ¥{totalAmount}
            </Text>
          </div>

          {/* 支付方式 */}
          <div style={{ marginBottom: 24 }}>
            <Text strong>支付方式：</Text>
            <Radio.Group
              value={payType}
              onChange={(e) => setPayType(e.target.value)}
              style={{ width: '100%' }}
            >
              <Space direction="vertical" style={{ width: '100%', marginTop: 8 }}>
                <Radio value="1">
                  <AlipayCircleOutlined style={{ color: '#1677ff', marginRight: 8 }} />
                  支付宝支付（推荐）
                </Radio>
                <Radio value="2">
                  <WechatOutlined style={{ color: '#07c160', marginRight: 8 }} />
                  微信支付
                </Radio>
                <Radio value="3">
                  <CreditCardOutlined style={{ color: '#fa8c16', marginRight: 8 }} />
                  货到付款
                </Radio>
              </Space>
            </Radio.Group>
          </div>

          {/* 操作按钮 */}
          <div style={{ textAlign: 'center' }}>
            <Space size="large">
              <Button onClick={onClose}>取消</Button>
              <Button
                type="primary"
                danger
                onClick={handleConfirmPay}
                loading={isPaying || loading}
                disabled={!sku}
              >
                确认支付
              </Button>
            </Space>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin />
        </div>
      )}
    </Modal>
  );
};

export default PaymentModal;